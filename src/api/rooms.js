const API_BASE = '/api';

export const getUsers = async () => {
  const res = await fetch(`${API_BASE}/users`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!res.ok) {
    throw new Error('Не удалось загрузить пользователей');
  }
  return res.json(); // ожидаем массив пользователей {id, name, email,...}
};

export const getRooms = async (userId) => {
  const res = await fetch(`${API_BASE}/users/${userId}/rooms`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!res.ok) {
    throw new Error('Не удалось загрузить комнаты');
  }
  return res.json(); // ожидаем массив комнат {id, name, params, ...}
};

export const createRoom = async (userId, data) => {
  const res = await fetch(`${API_BASE}/users/${userId}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data) // data: { name, params: {...} }
  });
  if (!res.ok) {
    throw new Error('Не удалось создать комнату');
  }
  return res.json(); // ожидаем созданную комнату
};
