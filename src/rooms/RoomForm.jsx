import React, { useState, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppContext } from '../context/AppContext';
import { createRoom } from '../api/rooms';
import Button from '../ui/Button';

const RoomForm = () => {
  const { user } = useContext(AppContext);
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [roomParams, setRoomParams] = useState('{}');

  const { mutate: createRoomMutate, isLoading, error } = useMutation(
    ({ userId, data }) => createRoom(userId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['rooms', user.id]);
        setName('');
        setRoomParams('{}');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return;
    let parsedRoomParams;
    try {
      parsedRoomParams = JSON.parse(roomParams);
    } catch {
      alert('Невірний JSON в параметрах кімнати');
      return;
    }
    createRoomMutate({ userId: user.id, data: { name, roomParams: parsedRoomParams } });
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500 text-sm mb-1">{error.message}</p>}
      <div className="flex items-center space-x-2 mb-2">
        <input
          type="text"
          placeholder="Назва кімнати"
          className="border rounded px-3 py-1 flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="JSON параметри"
          className="border rounded px-3 py-1 flex-1"
          value={roomParams}
          onChange={(e) => setRoomParams(e.target.value)}
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Створення...' : 'Додати кімнату'}
        </Button>
      </div>
    </form>
  );
};

export default RoomForm;
