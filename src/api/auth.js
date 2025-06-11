const API_BASE = '/api'; // базовый путь к backend API

export const login = async ({ email, password }) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    throw new Error('Ошибка авторизации');
  }
  return res.json(); // ожидаем { user, token }
};

export const register = async ({ name, email, password }) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  if (!res.ok) {
    throw new Error('Ошибка регистрации');
  }
  return res.json(); // ожидаем { user, token } или { user } и отдельно получить токен
};
