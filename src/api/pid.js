const API_BASE = '/api';

export const getPIDConfigs = async (roomId) => {
  const res = await fetch(`${API_BASE}/rooms/${roomId}/pidConfigs`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!res.ok) {
    throw new Error('Не удалось получить PID-конфигурации');
  }
  return res.json(); // ожидаем массив конфигураций {id, kp, ki, kd, tunedMethod, isActive}
};

export const createPIDConfig = async (roomId, config) => {
  const res = await fetch(`${API_BASE}/rooms/${roomId}/pidConfigs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(config) // { kp, ki, kd, tunedMethod }
  });
  if (!res.ok) {
    throw new Error('Не удалось добавить PID-конфигурацию');
  }
  return res.json();
};

export const setPIDActive = async (roomId, configId) => {
  const res = await fetch(`${API_BASE}/rooms/${roomId}/pidConfigs/${configId}/activate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!res.ok) {
    throw new Error('Не удалось установить активную конфигурацию');
  }
  return res.json();
};

export const autoTune = async (roomId) => {
  const res = await fetch(`${API_BASE}/rooms/${roomId}/pidConfigs/autoTune`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!res.ok) {
    throw new Error('Авто-тюнинг не выполнен');
  }
  return res.json();
};
