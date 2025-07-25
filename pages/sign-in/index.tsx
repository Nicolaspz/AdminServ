import { FormEvent, useContext, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import logoImg from '../../public/Logo.png';
import restaurantImg from '../../public/barTender.jpg'; // Adicione uma imagem de comida/restaurante
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/Button";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from 'react-toastify';

export default function Home() {
  const { signIn } = useContext(AuthContext);
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    if (credential === '' || password === '') {
      toast.warning("Preencha Todos os Campos");
      return;
    }
    setLoading(true);
    
    let data = {
      credential,
      password
    }
    await signIn(data);
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>ServeFixe - Faça Login</title>
      </Head>
      
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Seção da imagem (lado esquerdo em desktop) */}
        <div className="hidden md:block md:w-1/2 relative">
          <Image 
            src={restaurantImg}
            alt="Restaurante" 
            layout="fill"
            objectFit="cover"
            quality={100}
            priority
            className="brightness-90"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-8 z-10">
            <h2 className="text-3xl font-bold mb-2">Bem-vindo ao ServeFixe</h2>
            <p className="text-xl opacity-90">Sua solução completa para gestão de restaurantes</p>
          </div>
        </div>
        
        {/* Seção do formulário (lado direito em desktop) */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-8">
              <Image 
                src={logoImg} 
                alt="ServeFixe" 
                width={180}
                height={180}
                
              />
            </div>
            
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Login</h1>
              <p className="text-gray-600">Acesse o painel de gestão do seu restaurante</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="credential" className="block text-sm font-medium text-gray-700 mb-1">
                  Usuário ou E-mail
                </label>
                <Input
                  id="credential"
                  placeholder="Digite seu usuário ou e-mail"
                  type="text"
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <Input
                  id="password"
                  placeholder="Digite sua senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Lembrar-me
                  </label>
                </div>
                
                <div className="text-sm">
                  <a href="#" className="font-medium text-amber-600 hover:text-amber-500">
                    Esqueceu a senha?
                  </a>
                </div>
              </div>
              
              <div>
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Não tem uma conta?{' '}
                <a href="#" className="font-medium text-amber-600 hover:text-amber-500">
                  Cadastre-se
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}