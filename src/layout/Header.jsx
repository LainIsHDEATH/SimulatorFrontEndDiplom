import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Button from '../ui/Button';

const Header = () => {
  const { user, setUser, setRoom } = useContext(AppContext);

  const handleLogout = () => {
    setUser(null);
    setRoom(null);
    localStorage.removeItem('token');
  };

  return (
    <header className="w-full flex justify-between items-center bg-white border-b px-4 py-2">
      <h1 className="text-xl font-semibold">Temperature Simulation System</h1>
      {user && (
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Hello, {user.name}!</span>
          <Button onClick={handleLogout}>Log out</Button>
        </div>
      )}
    </header>
  );
};

export default Header;
