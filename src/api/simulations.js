const API_BASE = '/api';

export const getSimulations = async (roomId) => {
  const res = await fetch(`${API_BASE}/rooms/${roomId}/simulations`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!res.ok) {
    throw new Error('Не удалось загрузить список симуляций');
  }
  return res.json(); // ожидаем массив симуляций {id, controllerType, timestep, iterations, status, ...}
};

export const createSimulation = async (roomId, simData) => {
  const res = await fetch(`${API_BASE}/rooms/${roomId}/simulations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(simData)
    // simData включает: controllerType ('PID' или 'AI'), timestep, iterations, pidConfigId или modelId
  });
  if (!res.ok) {
    throw new Error('Не удалось создать симуляцию');
  }
  return res.json();
};

export const continueSimulation = async (simulationId) => {
  const res = await fetch(`${API_BASE}/simulations/${simulationId}/continue`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!res.ok) {
    throw new Error('Не удалось продолжить симуляцию');
  }
  return res.json();
};

export const getSimulationData = async (simulationId) => {
  const res = await fetch(`${API_BASE}/simulations/${simulationId}/data`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!res.ok) {
    throw new Error('Не удалось получить данные симуляции');
  }
  return res.json();
  // ожидаем массив объектов SensorDataDTO, напр. [{iteration: 1, tempIn: ..., tempOut: ..., heaterPower: ..., ...}, ...]
};
