import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppContext } from '../context/AppContext';
import { getUsers } from '../api/rooms';

const UserSelect = () => {
  const { user, setUser, setRoom } = useContext(AppContext);

  // Получаем список всех пользователей (для админа)
  const { data: users, isLoading, isError, error } = useQuery(['users'], getUsers);

  const handleChange = (e) => {
    const userId = e.target.value;
    const selected = users.find(u => u.id === userId);
    setUser(selected || null);
    setRoom(null);
  };

  if (isLoading) {
    return <p>Загрузка списку користувачів...</p>;
  }
  if (isError) {
    return <p className="text-red-500">Помилка загрузки користувачів: {error.message}</p>;
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Користувач:</label>
      <select
        value={user ? user.id : ''}
        onChange={handleChange}
        className="border rounded px-3 py-2"
      >
        <option value="" disabled>Оберіть користувача...</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>
            {u.name || u.email}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserSelect;
