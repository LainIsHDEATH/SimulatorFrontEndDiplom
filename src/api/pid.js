const API_BASE = 'http://storage-service:8082/api';
const AUTOTUNE_API_BASE = 'http://pid-autotune-service:7000';

export const getPIDConfigs = async (roomId) => {
  const res = await fetch(`${API_BASE}/pid-configs/room-configs/${roomId}`, {
    // headers: {
    //   'Authorization': `Bearer ${localStorage.getItem('token')}`
    // }
  });
  if (!res.ok) {
    throw new Error('Не удалось получить PID-конфигурации');
  }
  const json = await res.json();
  return Array.isArray(json.configs) ? json.configs : json; // ожидаем массив конфигураций {id, kp, ki, kd, tunedMethod, isActive}
};

export const createPIDConfig = async (roomId, config) => {
  const res = await fetch(`${API_BASE}/pid-configs/room-configs/${roomId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(config) // { kp, ki, kd, tunedMethod }
  });
  if (!res.ok) {
    throw new Error('Не удалось добавить PID-конфигурацию');
  }
  const json = await res.json();
  return Array.isArray(json.configs) ? json.configs : json;
};

export const setPIDActive = async (roomId, configId) => {
  const res = await fetch(`${API_BASE}/pid-configs/room-configs/${roomId}/${configId}/activate`, {
    method: 'POST',
    // headers: {
    //   'Authorization': `Bearer ${localStorage.getItem('token')}`
    // }
  });
  if (!res.ok) {
    throw new Error('Не удалось установить активную конфигурацию');
  }
  return res.json();
};

export async function autoTunePid(roomId, payload) {
  const res = await fetch(
    `${AUTOTUNE_API_BASE}/autotune`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ roomId, controllerType: 'AUTOTUNE_PID', ...payload })
    });
  if (!res.ok) throw new Error('Автотюн не запустился');
  return res.json();        // { session_id: ... }
}
