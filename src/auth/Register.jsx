import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AppContext } from '../context/AppContext';
import { register as registerApi } from '../api/auth';
import Card from '../ui/Card';
import Button from '../ui/Button';

const Register = () => {
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutate: register, isLoading, error } = useMutation(registerApi, {
    onSuccess: (data) => {
      // Предполагается, что API возвращает { user, token }
      setUser(data.user);
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      navigate('/dashboard');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    register({ username, email, password });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">Регистрация</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
          <div>
            <label className="block text-sm font-medium mb-1">Имя пользователя:</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Пароль:</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-center">
          Уже есть аккаунт? <Link to="/login" className="text-blue-600 hover:underline">Войти</Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;
