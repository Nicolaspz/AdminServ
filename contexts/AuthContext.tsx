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
  token?: string; // Tornado opcional
  role?: string;
  telefone?: string;
  organizationId?: string;
  user_name?: string;
  address?: string | null;
  imageLogo?: string | null;
  nif?: string | null;
  activeLicense?: string | boolean | null;
  name_org?: string;
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
  address?: string,
	imageLogo: string,
	nif: string,
	activeLicense: string,
	name_org: string
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)


export function signOut(){
  try{
    destroyCookie(undefined, '@sujeitopizza.token')
    Router.push('/sign-in')
  }catch{
   // console.log('erro ao deslogar')
  }
}

export function AuthProvider({ children }: AuthProviderProps){
  const [user, setUser] = useState<UserProps | null>(null);
  const isAuthenticated = !!user?.token;
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
          const { id, name, email, role, organizationId, user_name } = response.data;
          const orgData = response.data.Organization || {};
          
          setUser({
            id,
            name,
            email,
            role,
            user_name,
            token, // Garanta que o token está sendo setado
            organizationId,
            address: orgData.address || null,
            imageLogo: orgData.imageLogo || null,
            nif: orgData.nif || null,
            activeLicense: orgData.activeLicense || null,
            name_org: orgData.name || ''
          });
    
          api.defaults.headers['Authorization'] = `Bearer ${token}`;
          console.log("usuario", user)
        }
      } catch (error) {
        console.error("Erro ao verificar token:", error);
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
      
      //console.log("logado",response)
      toast.success("Logado com sucesso!");
      //console.log("Response-> ",response.data)
      const { id, name, email, user_name, token, role, organizationId } = response.data;
      const { address,imageLogo,nif,activeLicense} = response.data.Organization;
          
          const dados = response.data.Organization;
      //console.log("aqui", {token});
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
        organizationId, address,
        imageLogo,
        nif,
        activeLicense,
        name_org:dados.name,
      })
      //console.log("usuario logado", user);
      //Passar para proximas requisiçoes o nosso token
      api.defaults.headers['Authorization'] = `Bearer ${token}`
      
        Router.push('/dashboard');
     
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

      Router.push('/cardapio')

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