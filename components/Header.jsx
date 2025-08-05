import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';

const Header = ({title}) => {
  const { user, signOut } = useContext(AuthContext);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);

  const handleToggleLogout = () => {
    setIsLogoutVisible(!isLogoutVisible);
  };

  return (
    <div className='flex justify-between items-center px-6 py-4 bg-slate-800 border-b border-slate-700 text-slate-100'>
      <h2 className='text-lg font-semibold text-slate-200'>{title}</h2>
      
      <div className="relative">
        {user && (
          <div
            onClick={handleToggleLogout}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 group-hover:bg-slate-600 transition-colors">
              <FiUser className="text-slate-300 text-sm" />
            </div>
            <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
              {user.name}
            </span>
            <FiChevronDown className={`text-slate-400 transition-transform ${isLogoutVisible ? 'transform rotate-180' : ''}`} size={14} />
          </div>
        )}
        
        {isLogoutVisible && (
          <div 
            className="absolute top-10 right-0 mt-2 w-48 bg-slate-700 border border-slate-600 rounded-md shadow-lg overflow-hidden z-50"
            onMouseLeave={() => setIsLogoutVisible(false)}
          >
            <div className="py-1">
              <div className="px-4 py-2 text-xs text-slate-400 border-b border-slate-600">
                Logado como: {user.role}
              </div>
              <button
                onClick={signOut}
                className="w-full px-4 py-2 text-sm text-left text-slate-200 hover:bg-slate-600 hover:text-white transition-colors flex items-center space-x-2"
              >
                <FiLogOut className="text-slate-300" size={14} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;