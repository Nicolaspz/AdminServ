import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiSettings, FiCoffee, FiMenu, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { RxDashboard, RxPerson } from 'react-icons/rx';
import { HiOutlineShoppingBag, HiOutlineClipboardList } from 'react-icons/hi';
import { GiForkKnifeSpoon, GiCook, GiTable } from 'react-icons/gi';
import { FaUserFriends, FaBeer, FaShoppingCart } from 'react-icons/fa';
import { BiRestaurant } from 'react-icons/bi';
import { MdDashboard, MdInventory2 } from 'react-icons/md';
import { useRouter } from 'next/router';

const Sidebar = ({ children }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProdutosOpen, setIsProdutosOpen] = useState(false);
  
  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: <MdDashboard size={18} /> },
{ 
  href: '', 
  label: 'Produtos', 
  icon: <GiForkKnifeSpoon size={18} />,
  submenu: [
    { href: '/dashboard/igredient', label: 'Ingrediente' },
    { href: '/dashboard/produt', label: 'Produto' }
  ]
},
{ href: '/dashboard/stock', label: 'Stock', icon: <MdInventory2 size={18} /> },
{ href: '/dashboard/sales', label: 'Compra', icon: <FaShoppingCart size={18} /> },
{ href: '/dashboard/user', label: 'Usuários', icon: <FaUserFriends size={18} /> },
{ href: '/dashboard/cardapio', label: 'Cardápio', icon: <BiRestaurant size={18} /> },
{ href: '/dashboard/pedidos', label: 'Pedidos Bar', icon: <FaBeer size={18} /> },
{ href: '/dashboard/comida_pedido', label: 'Pedido Cozinha', icon: <GiCook size={18} /> },
{ href: '/dashboard/mesa', label: 'Mesas Abertas', icon: <GiTable size={18} /> },
{ href: '/dashboard/organization', label: 'Definições', icon: <FiSettings size={18} /> },


  ];

  useEffect(() => {
    const produtosItem = links.find(item => item.label === 'Produtos');
    if (produtosItem && produtosItem.submenu) {
      const shouldOpen = produtosItem.submenu.some(subItem => 
        router.pathname === subItem.href
      );
      setIsProdutosOpen(shouldOpen);
    }
  }, [router.pathname]);

  const toggleProdutosMenu = () => {
    setIsProdutosOpen(!isProdutosOpen);
  };

  const isActive = (href) => router.pathname === href;

  return (
    <div className='flex'>
      {/* Mobile Hamburger Button */}
      <button
        className='md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-700 text-white shadow-md hover:bg-slate-600 transition-colors'
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <FiMenu size={20} />
      </button>

      {/* Desktop Sidebar */}
      <div className='hidden md:flex fixed w-52 h-screen p-3 bg-slate-800 border-r border-slate-700 flex-col justify-between'>
        <div className='flex flex-col items-start space-y-1 mt-4'>
          {links.map(({ href, label, icon, submenu }, index) => (
            <div key={index} className="w-full">
              {submenu ? (
                <>
                  <div
                    className={`flex justify-between items-center rounded-md my-1 p-2 pl-3 w-full cursor-pointer transition-colors ${
                      isActive(href) || submenu.some(item => isActive(item.href)) 
                        ? 'bg-slate-600 text-white' 
                        : 'text-slate-200 hover:bg-slate-700 hover:text-white'
                    }`}
                    onClick={toggleProdutosMenu}
                  >
                    <div className="flex items-center space-x-2">
                      {React.cloneElement(icon, {
                        className: `flex-shrink-0 ${(isActive(href) || submenu.some(item => isActive(item.href))) ? 'text-white' : 'text-slate-300'}`,
                      })}
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    {isProdutosOpen ? (
                      <FiChevronDown className="text-slate-400" size={16} />
                    ) : (
                      <FiChevronRight className="text-slate-400" size={16} />
                    )}
                  </div>
                  
                  {(isProdutosOpen || submenu.some(item => isActive(item.href))) && (
                    <div className="ml-6">
                      {submenu.map((subItem, subIndex) => (
                        <Link key={subIndex} href={subItem.href}>
                          <div
                            className={`flex items-center rounded-md my-1 p-2 pl-3 w-full text-sm transition-colors ${
                              isActive(subItem.href) 
                                ? 'bg-slate-600 text-white' 
                                : 'text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer'
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
                <Link href={href} className="w-full">
                  <div
                    className={`flex items-center rounded-md my-1 p-2 pl-3 w-full transition-colors ${
                      isActive(href) 
                        ? 'bg-slate-600 text-white' 
                        : 'text-slate-200 hover:bg-slate-700 hover:text-white cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {React.cloneElement(icon, {
                        className: `flex-shrink-0 ${isActive(href) ? 'text-white' : 'text-slate-300'}`,
                      })}
                      <span className="text-sm font-medium">{label}</span>
                    </div>
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
        className={`fixed top-0 left-0 h-full w-64 bg-slate-800 border-r border-slate-700 z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <div className='p-3 flex flex-col h-full'>
          <div className='flex flex-col items-start mt-4 space-y-1'>
            {links.map(({ href, label, icon, submenu }, index) => (
              <div key={index} className="w-full">
                {submenu ? (
                  <>
                    <div
                      onClick={() => setIsProdutosOpen(!isProdutosOpen)}
                      className={`flex justify-between items-center rounded-md my-1 p-2 pl-3 w-full cursor-pointer transition-colors ${
                        isActive(href) || submenu.some(item => isActive(item.href)) 
                          ? 'bg-slate-600 text-white' 
                          : 'text-slate-200 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {React.cloneElement(icon, {
                          className: `flex-shrink-0 ${(isActive(href) || submenu.some(item => isActive(item.href))) ? 'text-white' : 'text-slate-300'}`,
                        })}
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                      {isProdutosOpen || submenu.some(item => isActive(item.href)) ? (
                        <FiChevronDown className="text-slate-400" size={16} />
                      ) : (
                        <FiChevronRight className="text-slate-400" size={16} />
                      )}
                    </div>
                    
                    {(isProdutosOpen || submenu.some(item => isActive(item.href))) && (
                      <div className="ml-6">
                        {submenu.map((subItem, subIndex) => (
                          <Link key={subIndex} href={subItem.href}>
                            <div
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`flex items-center rounded-md my-1 p-2 pl-3 w-full text-sm transition-colors ${
                                isActive(subItem.href) 
                                  ? 'bg-slate-600 text-white' 
                                  : 'text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer'
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
                  <Link href={href} className="w-full">
                    <div
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center rounded-md my-1 p-2 pl-3 w-full transition-colors ${
                        isActive(href) 
                          ? 'bg-slate-600 text-white' 
                          : 'text-slate-200 hover:bg-slate-700 hover:text-white cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {React.cloneElement(icon, {
                          className: `flex-shrink-0 ${isActive(href) ? 'text-white' : 'text-slate-300'}`,
                        })}
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className='md:ml-52 w-full transition-all duration-300 '>
        {children}
      </main>
    </div>
  );
};

export default Sidebar;