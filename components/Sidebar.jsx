import React, { useState } from 'react';
import Link from 'next/link';
import { FiSettings, FiCoffee, FiMenu } from 'react-icons/fi';
import { RxDashboard, RxPerson } from 'react-icons/rx';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { useRouter } from 'next/router';

const Sidebar = ({ children }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    //{ href: '/dashboard', label: 'Relatórios', icon: <RxDashboard size={20} /> },
    { href: '/produt', label: 'Produtos', icon: <RxDashboard size={20} /> },
    { href: '/stock', label: 'Stock', icon: <FiCoffee size={20} /> },
    { href: '/sales', label: 'Compra', icon: <HiOutlineShoppingBag size={20} /> },
    //{ href: '/Pagamentos', label: 'pagamento', icon: <RxPerson size={20} /> },
    { href: '/user', label: 'Usuários', icon: <RxPerson size={20} /> },
  ];

  return (
    <div className='flex'>
      {/* Mobile Hamburger Button */}
      <button
        className='md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-purple-800 text-white'
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <FiMenu size={24} />
      </button>

      {/* Desktop Sidebar */}
      <div className='hidden md:block fixed w-30 h-screen p-4 bg-white border-r-[1px] flex flex-col justify-between'>
        <div className='flex flex-col items-center'>
          {links.map(({ href, label, icon }, index) => (
            <Link key={index} href={href}>
              <div
                style={{ width: '140px' }}
                className={`flex justify-center items-center rounded-lg my-4 p-3 inline-block ${
                  router.pathname === href ? 'bg-purple-800 text-white' : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'
                }`}
              >
                {React.cloneElement(icon, {
                  className: `mr-1 ${router.pathname === href ? 'text-white' : 'text-purple-800'}`,
                })}
                <span className={`${router.pathname === href ? 'text-white' : 'text-purple-800'}`}>{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden'
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <div className='p-4 flex flex-col h-full'>
          <div className='flex flex-col items-center mt-8'>
            {links.map(({ href, label, icon }, index) => (
              <Link key={index} href={href}>
                <div
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex justify-center items-center rounded-lg my-2 p-3 w-full ${
                    router.pathname === href ? 'bg-purple-800 text-white' : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'
                  }`}
                >
                  {React.cloneElement(icon, {
                    className: `mr-2 ${router.pathname === href ? 'text-white' : 'text-purple-800'}`,
                  })}
                  <span className={`${router.pathname === href ? 'text-white' : 'text-purple-800'}`}>{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className='md:ml-20 w-full'>{children}</main>
    </div>
  );
};

export default Sidebar;