import { createContext, ReactNode, useState, useEffect } from "react";
import {destroyCookie,setCookie,parseCookies} from 'nookies'
import {toast} from 'react-toastify'
import Router from 'next/router'

import { api } from '../services/apiClients';



type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
  id?: string;
  name?: string;
  email?: string;
  token: string;
  role?: string;
  telefone?: string;
  organizationId?: string;
  user_name?: string;
}

type SignInProps = {
  credential: string;
  password: string;
}

type SignUpProps = {
  id: string;
  name: string;
  email: string;
  role: string;
  telefone: string;
  organizationId: string;
  user_name: string;  
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)


export function signOut(){
  try{
    destroyCookie(undefined, '@sujeitopizza.token')
    Router.push('/')
  }catch{
    console.log('erro ao deslogar')
  }
}

export function AuthProvider({ children }: AuthProviderProps){
  const [user, setUser] = useState<UserProps>({
    id: '',
    name: '',
    email: '',
    token: '',
    role: '',
    telefone: '',
    user_name: '',
    organizationId:'',
  });
  const isAuthenticated = !!user;
  const inactivityTimeout = 15 * 60 * 1000; 
  let inactivityTimer: NodeJS.Timeout;

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      signOut(); // Chama a função de logout após o tempo de inatividade
    }, inactivityTimeout);
  };

  const handleUserInteraction = () => {
    resetInactivityTimer();
  };

  useEffect(() =>  {
    const checkToken = async () => {
      try {
        const { '@sujeitopizza.token': token } = parseCookies();

        if (token) {
          const response = await api.get('/me');
          const { id,name,email,role,user_name} = response.data;
         
          console.log("me", response.data);
          setUser({
            id,email,name,role,user_name,token
          });

          //console.log("Logado");
           console.log("token->",token);
        }
      } catch (error) {
        console.log("Erro ao verificar o token", error);
        signOut();
      }
    };

    checkToken(); // Verifica o token ao carregar o componente

    // Adiciona event listeners para redefinir o temporizador em interações do usuário
    window.addEventListener('mousemove', handleUserInteraction);
    window.addEventListener('mousedown', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);

    // Inicia o temporizador quando o componente é montado
    resetInactivityTimer();

    return () => {
      // Remove os event listeners e limpa o temporizador quando o componente é desmontado
      window.removeEventListener('mousemove', handleUserInteraction);
      window.removeEventListener('mousedown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      clearTimeout(inactivityTimer);
    };

    // Restante do seu código...

  }, []);

  async function signIn({ credential, password }: SignInProps){
    try{
      const response = await api.post('/session', {
        credential,
        password
      })
      
      console.log("aqui",response)
      toast.success("Logado com sucesso!");
      console.log("Response-> ",response.data)
      const {id,name,email,user_name,token,role,organizationId} = response.data;
      console.log("aqui", {token});
      setCookie(undefined, '@sujeitopizza.token', token, {
        maxAge: 60 * 60 * 24 * 30, // Expirar em 1 mes
        path: "/" // Quais caminhos terao acesso ao cookie
      })

      setUser({
        id,
        name,
        role,
        token,
        user_name,
        organizationId,
        email
      })
      console.log("aqui", user);
      //Passar para proximas requisiçoes o nosso token
      api.defaults.headers['Authorization'] = `Bearer ${token}`
      
        Router.push('/produt');
     
    }catch(err){
      toast.error("Erro ao Logar")
      console.log("erro aki",err);
    }
  }


  async function signUp({ name, email,role,user_name}: SignUpProps){
    try{
      
      const response = await api.post('/users', {
        name,
        email,
        role,
        user_name
      })

      toast.success("Cadastrado com sucesso!")

      Router.push('/')

    }catch(err){
      toast.error("Erro ao se Cadastrar")
    }
  }

  return(
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut,signUp}}>
      {children}
    </AuthContext.Provider>
  )
}