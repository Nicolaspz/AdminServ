
import Head from "next/head";
import logoImg from '../public/Logo.png';

import { useState } from 'react';
import { FaUtensils, FaMobileAlt, FaChartLine, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import Image from "next/image";

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar o email para cadastro
    console.log('Email enviado:', email);
    alert('Obrigado pelo interesse! Entraremos em contato em breve.');
    setEmail('');
  };

  return (
<>
  <Head>
    <title>
      Serve Fixe
      </title>
  </Head>
  
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image 
              src={logoImg} 
              alt="ServeFixe" 
               width={70}
               height={70}
              
            />
           
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-orange-500">Recursos</a>
            <a href="#pricing" className="text-gray-600 hover:text-orange-500">Planos</a>
            <a href="#about" className="text-gray-600 hover:text-orange-500">Sobre</a>
            <a href="#contact" className="text-gray-600 hover:text-orange-500">Contato</a>
          </nav>
          
          <div className="hidden md:flex space-x-4">
            <a href="/sign-in" className="px-4 py-2 text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-50">
              <FaSignInAlt className="inline mr-2" />
              Login
              
            </a>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              <FaUserPlus className="inline mr-2" />
              Cadastre-se
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white py-4 px-4 shadow-md">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-600 hover:text-orange-500">Recursos</a>
              <a href="#pricing" className="text-gray-600 hover:text-orange-500">Planos</a>
              <a href="#about" className="text-gray-600 hover:text-orange-500">Sobre</a>
              <a href="#contact" className="text-gray-600 hover:text-orange-500">Contato</a>
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <button className="w-full py-2 text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-50">
                  <FaSignInAlt className="inline mr-2" />
                  Login
                </button>
                <button className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                  <FaUserPlus className="inline mr-2" />
                  Cadastre-se
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-400 to-orange-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Sistema Completo para Gestão de Restaurantes</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Gerencie pedidos, estoque, funcionários e clientes em uma única plataforma intuitiva e poderosa.
          </p>
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                className="flex-grow px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Solicitar Demonstração
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Recursos do Sistema</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-orange-500 text-4xl mb-4">
                <FaMobileAlt />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pedidos Online</h3>
              <p className="text-gray-600">
                Sistema de pedidos integrado com mesa/comanda, delivery e retirada. Interface amigável para garçons e clientes.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-orange-500 text-4xl mb-4">
                <FaChartLine />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestão Completa</h3>
              <p className="text-gray-600">
                Controle de estoque, finanças, funcionários e relatórios em tempo real para tomar decisões estratégicas.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-orange-500 text-4xl mb-4">
                <FaUserPlus />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fidelização</h3>
              <p className="text-gray-600">
                Programa de fidelidade integrado, cadastro de clientes e marketing digital para aumentar suas vendas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Planos e Assinaturas</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="border border-gray-200 rounded-xl bg-white p-6 hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">Básico</h3>
              <p className="text-gray-600 mb-4">Para pequenos estabelecimentos</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">R$199</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Até 2 caixas
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Gestão de pedidos
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Relatórios básicos
                </li>
              </ul>
              <button className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                Assinar Plano
              </button>
            </div>
            
            <div className="border-2 border-orange-500 rounded-xl bg-white p-6 transform hover:scale-105 transition shadow-lg">
              <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                MAIS POPULAR
              </div>
              <h3 className="text-xl font-semibold mb-2">Profissional</h3>
              <p className="text-gray-600 mb-4">Para restaurantes em crescimento</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">R$399</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Até 5 caixas
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Gestão completa
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Relatórios avançados
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  App para clientes
                </li>
              </ul>
              <button className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                Assinar Plano
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-xl bg-white p-6 hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-4">Para redes de restaurantes</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">R$899</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Caixas ilimitados
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Multi-franquias
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Suporte prioritário
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Personalização
                </li>
              </ul>
              <button className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                Fale Conosco
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para transformar seu restaurante?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Experimente gratuitamente por 14 dias. Sem necessidade de cartão de crédito.
          </p>
          <button className="px-8 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg">
            Comece Agora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
               <Image 
              src={logoImg} 
              alt="ServeFixe" 
               width={70}
               height={70}
              
            />
                
              </div>
              <p className="mb-4">
                O sistema completo para gestão de restaurantes, bares e lanchonetes.
              </p>
              <div className="flex space-x-4">
                {/* Ícones de redes sociais */}
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-orange-400">Home</a></li>
                <li><a href="#features" className="hover:text-orange-400">Recursos</a></li>
                <li><a href="#pricing" className="hover:text-orange-400">Planos</a></li>
                <li><a href="#about" className="hover:text-orange-400">Sobre Nós</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-orange-400">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-orange-400">Documentação</a></li>
                <li><a href="#" className="hover:text-orange-400">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-orange-400">Política de Privacidade</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Contato</h3>
              <address className="not-italic">
                <p className="mb-2">contato@restosystem.com</p>
                <p className="mb-2">+55 (11) 1234-5678</p>
                <p>Av. Paulista, 1000<br/>São Paulo - SP</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} RestoSystem. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
      </div>
</>
  );
}

