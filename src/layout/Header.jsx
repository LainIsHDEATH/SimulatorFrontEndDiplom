import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Button from '../ui/Button';

const Header = () => {
  const { user, setUser, setRoom } = useContext(AppContext);

  const handleLogout = () => {
    // Очистка текущего пользователя и комнаты, удаление токена
    setUser(null);
    setRoom(null);
    localStorage.removeItem('token');
    // После этого Redirect осуществляется через Navigate компонент в Layout
  };

  return (
    <header className="w-full flex justify-between items-center bg-white border-b px-4 py-2">
      <h1 className="text-xl font-semibold">Temperature Simulation System</h1>
      {user && (
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Привет, {user.name}!</span>
          <Button onClick={handleLogout}>Выйти</Button>
        </div>
      )}
    </header>
  );
};

export default Header;
