import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import Login from './auth/Login';
import Register from './auth/Register';
import Dashboard from './rooms/Dashboard';

const App = () => {
  return (
    <Routes>
      {/* Маршруты без Layout (без авторизации) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Защищенные маршруты под главным Layout */}
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route index element={<Navigate to="dashboard" />} />
      </Route>

      {/* 404 Not Found маршрут по желанию */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default App;


