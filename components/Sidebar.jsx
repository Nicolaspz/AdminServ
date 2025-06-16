import React, { useState } from 'react';
import Link from 'next/link';
import { FiSettings, FiCoffee, FiMenu, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { RxDashboard, RxPerson } from 'react-icons/rx';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { useRouter } from 'next/router';

const Sidebar = ({ children }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProdutosOpen, setIsProdutosOpen] = useState(false);
  
  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: <FiCoffee size={20} /> },
    
    { 
      href: '', 
      label: 'Produtos', 
      icon: <RxDashboard size={20} />,
      submenu: [
        { href: '/igredient', label: 'Igrediente' },
        { href: '/produt', label: 'produto' }
      ]
    },
    { href: '/stock', label: 'Stock', icon: <FiCoffee size={20} /> },
    { href: '/sales', label: 'Compra', icon: <HiOutlineShoppingBag size={20} /> },
    { href: '/recipe', label: 'Receitas', icon: <HiOutlineShoppingBag size={20} /> },
    { href: '/user', label: 'Usuários', icon: <RxPerson size={20} /> },
    { href: '/organization', label: 'Organização', icon: <RxPerson size={20} /> },
  ];

  const toggleProdutosMenu = () => {
    setIsProdutosOpen(!isProdutosOpen);
  };

  const isActive = (href) => router.pathname === href;

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
          {links.map(({ href, label, icon, submenu }, index) => (
            <div key={index} className="w-full">
              {submenu ? (
                <>
                  <div
                    style={{ width: '140px' }}
                    className={`flex justify-between items-center rounded-lg my-1 p-3 cursor-pointer ${
                      isActive(href) || submenu.some(item => isActive(item.href)) 
                        ? 'bg-purple-800 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={toggleProdutosMenu}
                  >
                    <div className="flex items-center">
                      {React.cloneElement(icon, {
                        className: `mr-1 ${isActive(href) || submenu.some(item => isActive(item.href)) ? 'text-white' : 'text-purple-800'}`,
                      })}
                      <span>{label}</span>
                    </div>
                    {isProdutosOpen ? <FiChevronDown /> : <FiChevronRight />}
                  </div>
                  
                  {isProdutosOpen && (
                    <div className="ml-4">
                      {submenu.map((subItem, subIndex) => (
                        <Link key={subIndex} href={subItem.href}>
                          <div
                            style={{ width: '120px' }}
                            className={`flex items-center rounded-lg my-1 p-2 pl-4 ${
                              isActive(subItem.href) 
                                ? 'bg-purple-600 text-white' 
                                : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                            }`}
                          >
                            <span>{subItem.label}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={href}>
                  <div
                    style={{ width: '140px' }}
                    className={`flex justify-center items-center rounded-lg my-4 p-3 inline-block ${
                      isActive(href) ? 'bg-purple-800 text-white' : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'
                    }`}
                  >
                    {React.cloneElement(icon, {
                      className: `mr-1 ${isActive(href) ? 'text-white' : 'text-purple-800'}`,
                    })}
                    <span>{label}</span>
                  </div>
                </Link>
              )}
            </div>
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
            {links.map(({ href, label, icon, submenu }, index) => (
              <div key={index} className="w-full">
                {submenu ? (
                  <>
                    <div
                      onClick={() => setIsProdutosOpen(!isProdutosOpen)}
                      className={`flex justify-between items-center rounded-lg my-1 p-3 w-full ${
                        isActive(href) || submenu.some(item => isActive(item.href)) 
                          ? 'bg-purple-800 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center">
                        {React.cloneElement(icon, {
                          className: `mr-2 ${isActive(href) || submenu.some(item => isActive(item.href)) ? 'text-white' : 'text-purple-800'}`,
                        })}
                        <span>{label}</span>
                      </div>
                      {isProdutosOpen ? <FiChevronDown /> : <FiChevronRight />}
                    </div>
                    
                    {isProdutosOpen && (
                      <div className="ml-4">
                        {submenu.map((subItem, subIndex) => (
                          <Link key={subIndex} href={subItem.href}>
                            <div
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`flex items-center rounded-lg my-1 p-2 pl-4 w-full ${
                                isActive(subItem.href) 
                                  ? 'bg-purple-600 text-white' 
                                  : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                              }`}
                            >
                              <span>{subItem.label}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={href}>
                    <div
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex justify-center items-center rounded-lg my-2 p-3 w-full ${
                        isActive(href) ? 'bg-purple-800 text-white' : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'
                      }`}
                    >
                      {React.cloneElement(icon, {
                        className: `mr-2 ${isActive(href) ? 'text-white' : 'text-purple-800'}`,
                      })}
                      <span>{label}</span>
                    </div>
                  </Link>
                )}
              </div>
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