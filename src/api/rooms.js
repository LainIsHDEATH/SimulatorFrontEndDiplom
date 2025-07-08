const API_BASE = 'http://storage-service:8082/api';

export const getUsers = async () => {
  const res = await fetch(`${API_BASE}/users`, {
    // headers: {
    //   'Authorization': `Bearer ${localStorage.getItem('token')}`
    // }
  });
  if (!res.ok) {
    throw new Error('Не удалось загрузить пользователей');
  }
  const json = await res.json();
  return Array.isArray(json.users) ? json.users : json;  // ожидаем массив пользователей {id, name, email,...}
};

export const getRooms = async (userId) => {
  const res = await fetch(`${API_BASE}/rooms/user-rooms/${userId}`, {
    // headers: {
    //   'Authorization': `Bearer ${localStorage.getItem('token')}`
    // }
  });
  if (!res.ok) {
    throw new Error('Не удалось загрузить комнаты');
  }
  const json = await res.json();
  return Array.isArray(json.rooms) ? json.rooms : json; // ожидаем массив комнат {id, name, params, ...}
};

export const createRoom = async (userId, data) => {
  const res = await fetch(`${API_BASE}/rooms/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data) // data: { name, params: {...} }
  });
  if (!res.ok) {
    throw new Error('Не удалось создать комнату');
  }
  const json = await res.json();
  return Array.isArray(json.room) ? json.room : json; // ожидаем созданную комнату
};
