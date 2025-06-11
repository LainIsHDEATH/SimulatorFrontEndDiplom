const API_BASE = '/api';

export const getModels = async (roomId) => {
  const res = await fetch(`${API_BASE}/rooms/${roomId}/models`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!res.ok) {
    throw new Error('Не удалось загрузить модели');
  }
  return res.json(); // ожидаем массив моделей {id, name, type, isActive, ...}
};

export const createLstmModel = async (roomId, { name, epochs, trainingSimId }) => {
  const res = await fetch(`${API_BASE}/rooms/${roomId}/models`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ name, type: 'LSTM', params: { epochs, trainingSimId } })
  });
  if (!res.ok) {
    throw new Error('Не удалось создать LSTM-модель');
  }
  return res.json();
};

export const createRlModel = async (roomId, { name, episodes }) => {
  const res = await fetch(`${API_BASE}/rooms/${roomId}/models`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ name, type: 'RL', params: { episodes } })
  });
  if (!res.ok) {
    throw new Error('Не удалось создать RL-модель');
  }
  return res.json();
};

export const setModelActive = async (roomId, modelId) => {
  const res = await fetch(`${API_BASE}/rooms/${roomId}/models/${modelId}/activate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!res.ok) {
    throw new Error('Не удалось активировать модель');
  }
  return res.json();
};
