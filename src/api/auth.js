const API_BASE = 'http://localhost:8082/api'; // базовый путь к backend API

export const login = async ({ email, password }) => {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    throw new Error('Auth error');
  }
  return res.json(); // ожидаем { user, token }
};

export const register = async ({ username, email, password }) => {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  if (!res.ok) {
    throw new Error('Auth error');
  }
  return res.json();
};
