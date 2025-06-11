import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppContext } from '../context/AppContext';
import { getRooms } from '../api/rooms';

const RoomList = () => {
  const { user, room, setRoom } = useContext(AppContext);

  // Получаем список комнат выбранного пользователя
  const userId = user ? user.id : null;
  const { data: rooms, isLoading, isError, error } = useQuery(
    ['rooms', userId],
    () => getRooms(userId),
    { enabled: !!userId }
  );

  const handleSelectRoom = (roomItem) => {
    setRoom(roomItem);
  };

  if (!user) {
    return null; // если пользователь не выбран, ничего не показываем
  }
  if (isLoading) {
    return <p>Загрузка комнат...</p>;
  }
  if (isError) {
    return <p className="text-red-500">Ошибка загрузки комнат: {error.message}</p>;
  }

  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">Комнаты:</h3>
      {rooms.length === 0 ? (
        <p>Нет комнат.</p>
      ) : (
        <ul className="space-y-1">
          {rooms.map(r => (
            <li
              key={r.id}
              className={`cursor-pointer px-3 py-2 rounded ${room && r.id === room.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => handleSelectRoom(r)}
            >
              {r.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoomList;
