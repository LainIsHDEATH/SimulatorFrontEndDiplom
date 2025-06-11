import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
  const { user } = useContext(AppContext);

  // Если пользователь не вошел в систему, перенаправляем на /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 overflow-auto">
          {/* Контент страниц будет отображаться здесь */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
