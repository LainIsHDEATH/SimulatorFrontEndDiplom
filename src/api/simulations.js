const API_BASE = 'http://storage-service:8082/api';

export const getSimulations = async (roomId) => {
  const res = await fetch(`${API_BASE}/simulations/room-simulations/${roomId}`, {
    // headers: {
    //   'Authorization': `Bearer ${localStorage.getItem('token')}`
    // }
  });
  if (!res.ok) {
    throw new Error('Не удалось загрузить список симуляций');
  }
  const json = await res.json();
  return Array.isArray(json.simulations) ? json.simulations : json; // ожидаем массив симуляций {id, controllerType, timestep, iterations, status, ...}
};

export const createSimulation = async (roomId, simData) => {
  const payload = { roomId, ...simData };
  const res = await fetch(`http://room-simulator-service:8080/api/simulations/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(payload)
    // simData включает: controllerType ('PID' или 'AI'), timestep, iterations, pidConfigId или modelId
  });
  if (!res.ok) {
    throw new Error('Не удалось создать симуляцию');
  }
  const json = await res.json();
  return Array.isArray(json.simulations) ? json.simulations : json;
};

// export const continueSimulation = async (simulationId) => {
//   const res = await fetch(`${API_BASE}/simulations/${simulationId}/continue`, {
//     method: 'POST',
//     // headers: {
//     //   'Authorization': `Bearer ${localStorage.getItem('token')}`
//     // }
//   });
//   if (!res.ok) {
//     throw new Error('Не удалось продолжить симуляцию');
//   }
//   const json = await res.json();
//   return Array.isArray(json.simulations) ? json.simulations : json;
// };

export const getSimulationDataPage = async (simId, page = 0, size = 1000) => {
  const res = await fetch(
    `${API_BASE}/sensor-data/simulation-data/${simId}?page=${page}&size=${size}`);
  if (!res.ok) throw new Error('Не удалось получить данные');
  const json = await res.json();
  // сервер может вернуть либо {data: [...]}, либо {sensorDataList: [...]}
  return (
    json.data ??
    json.sensorData ??
    json.sensorDataList ??
    []                // fallback: пустой массив
  );
};

export const getSimulationMetrics = async (simId) => {
  const res = await fetch(`${API_BASE}/simulations/${simId}/metrics`);
  if (!res.ok) throw new Error('Не удалось получить метрики');
  return await res.json();          // {mae, rmse, energyKWh, overshoot, …}
};

