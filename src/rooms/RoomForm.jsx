import React, { useState, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppContext } from '../context/AppContext';
import { createRoom } from '../api/rooms';
import Button from '../ui/Button';

const RoomForm = () => {
  const { user } = useContext(AppContext);
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [params, setParams] = useState('{}'); // JSON параметры в текстовом виде

  const { mutate: createRoomMutate, isLoading, error } = useMutation(
    ({ userId, data }) => createRoom(userId, data),
    {
      onSuccess: () => {
        // обновляем список комнат после создания
        queryClient.invalidateQueries(['rooms', user.id]);
        setName('');
        setParams('{}');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return;
    let parsedParams;
    try {
      parsedParams = JSON.parse(params);
    } catch {
      alert('Неверный JSON в параметрах комнаты');
      return;
    }
    createRoomMutate({ userId: user.id, data: { name, params: parsedParams } });
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500 text-sm mb-1">{error.message}</p>}
      <div className="flex items-center space-x-2 mb-2">
        <input
          type="text"
          placeholder="Название комнаты"
          className="border rounded px-3 py-1 flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="JSON параметры"
          className="border rounded px-3 py-1 flex-1"
          value={params}
          onChange={(e) => setParams(e.target.value)}
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Создание...' : 'Добавить комнату'}
        </Button>
      </div>
    </form>
  );
};

export default RoomForm;
