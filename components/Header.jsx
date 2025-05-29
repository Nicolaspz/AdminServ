import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
  const { user, signOut } = useContext(AuthContext);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);

  const handleToggleLogout = () => {
    setIsLogoutVisible(!isLogoutVisible);
  };

  return (
    <div className='flex justify-between px-8 pt-4 bg-purple-800 text-white p-4' >
      <h2 className='pl-16'>Dashboard</h2>
      <div className="relative group">
        {user && (
          <div
            onClick={handleToggleLogout}
            className="cursor-pointer text-white"
          >
            {user.name}
          </div>
        )}
        {isLogoutVisible && (
          <div className="absolute top-10 right-0 bg-white p-4 rounded shadow">
            <button
              onClick={signOut}
              className="text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
