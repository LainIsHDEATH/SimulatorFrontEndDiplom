const API_BASE = 'http://localhost:8082/api';

export const getModels = async (roomId) => {
  const res = await fetch(`${API_BASE}/models/room-models/${roomId}`, {
    // headers: {
    //   'Authorization': `Bearer ${localStorage.getItem('token')}`
    // }
  });
  if (!res.ok) {
    throw new Error('Не удалось загрузить модели');
  }
  const json = await res.json();
  return Array.isArray(json.models) ? json.models : json; // ожидаем массив моделей {id, name, type, isActive, ...}
};

export const createLstmModel = async (roomId, { name, epochs, trainingSimId }) => {
  const res = await fetch(`${API_BASE}/rooms/${roomId}/models`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ name, type: 'LSTM', params: { epochs, trainingSimId } })
  });
  if (!res.ok) {
    throw new Error('Не удалось создать LSTM-модель');
  }
  const json = await res.json();
  return Array.isArray(json.models) ? json.models : json;
};

export const createRlModel = async (roomId, { name, episodes }) => {
  const res = await fetch(`${API_BASE}/rooms/${roomId}/models`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ name, type: 'RL', params: { episodes } })
  });
  if (!res.ok) {
    throw new Error('Не удалось создать RL-модель');
  }
  const json = await res.json();
  return Array.isArray(json.models) ? json.models : json;
};

export const setModelActive = async (roomId, modelId) => {
  const res = await fetch(`${API_BASE}/rooms/${roomId}/models/${modelId}/activate`, {
    method: 'POST',
    // headers: {
    //   'Authorization': `Bearer ${localStorage.getItem('token')}`
    // }
  });
  if (!res.ok) {
    throw new Error('Не удалось активировать модель');
  }
  const json = await res.json();
  return Array.isArray(json.models) ? json.models : json;
};
