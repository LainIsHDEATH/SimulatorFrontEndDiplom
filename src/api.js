// Mock API
export const API = {
    /* USERS */
  register: (body) => fetch("http://localhost:8082/api/users/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }).then(r => r.json()),
  getUsers: () => fetch("http://localhost:8082/api/users").then(r => r.json()),

    /* ROOMS */
    createRoom: (userId, body) => fetch(`http://localhost:8082/api/rooms/${userId}`, {method:"POST",body:JSON.stringify(body)}).then(r=>r.json()),
    getRoomsByUser: (userId)   => fetch(`http://localhost:8082/api/rooms/user-rooms/${userId}`).then(r=>r.json()),
    getRooms: async () => [{ id: "r1", name: "Комната 1" }, { id: "r2", name: "Комната 2" }
    ],

    /* SIMULATIONS, PID, MODELS */
    // getSimulations: (roomId)=>fetch(`http://localhost:8082/api/simulations/room-simulations/${roomId}`).then(r=>r.json()),
    getSimulations: async (roomId) => [{ id: "s1", roomId, name: "PID, 2025-06-07 12:00", status: "FINISHED" }, { id: "s2", roomId, name: "RL Agent, 2025-06-07 12:45", status: "RUNNING", progress: 67 }],
    getPidConfigs:  (roomId)=>fetch(`http://localhost:8082/api/pid-configs/room-configs/${roomId}`).then(r=>r.json()),
    // getModels:      (roomId)=>fetch(`http://localhost:8082/api/models/room-models/${roomId}`).then(r=>r.json()),
    getModels: async (roomId) => [{ id: "lstm_1", name: "LSTM 05.06.25", type: "LSTM" }, { id: "rl_1", name: "RL 05.06.25", type: "RL" }],
    trainLSTM: async (roomId, simulationId) => {
        // Возвращает модель и статус
        return { id: `lstm_${roomId}_${simulationId}`, name: `LSTM от ${new Date().toLocaleString()}` };
    },
    trainRL: async (roomId) => {
        // RL-обучение запускает "симуляцию", затем возвращает модель
        return { id: `rl_${roomId}_${Date.now()}`, name: `RL от ${new Date().toLocaleString()}` };
    },


    getSimulationData: async (simulationId) => {
        // Сгенерированные данные для графика
        const steps = 1000;
        let arr = [];
        let temp = 19, power = 0;
        for (let i = 0; i < steps; i++) {
            power = Math.max(0, Math.min(1000, Math.sin(i/100)*500 + 500));
            temp += (power/1000 - 0.01 * (temp - 5)) * 0.2;
            arr.push({ step: i, temp: parseFloat(temp.toFixed(2)), power: parseInt(power), time: +`${i} сек` });
        }
        return arr;
    },
    getSimulationProgress: async (simulationId) => {
        // Просто mock: 0-100%
        return Math.min(100, Math.floor(Math.random()*100));
    },

    launchSimulation: async (roomId, controllerType) => {
        // Возвращает новый simulationId
        return { id: `s${Math.random()}`,
            status: "RUNNING", progress: 0,
            name: `${controllerType}, ${new Date().toISOString()}` }
    },
    // launchSimulation:(roomId, payload)=>fetch(`http://localhost:8082/api/simulations/${roomId}`,{method:"POST",body:JSON.stringify(payload)}).then(r=>r.json()),
    continueSimulation:(simId, more)=>fetch(`http://localhost:8082/api/sensor-data/simulation-data/${simId}/batch`,{method:"POST",body:JSON.stringify({more})}),
    /* … остальные (autotune, train LSTM/RL) */
}