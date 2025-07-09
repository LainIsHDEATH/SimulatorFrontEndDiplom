import React, { useState, useContext } from 'react';
import { useQuery }                 from '@tanstack/react-query';
import { AppContext }               from '../context/AppContext';
import { getPIDConfigs }            from '../api/pid';
import { getModels }                from '../api/models';
import Button                       from '../ui/Button';

const SimulationForm = ({ onCreate, onCancel }) => {
  const { room } = useContext(AppContext);

  const [controllerType, setControllerType] = useState('PID');
  const [pidConfigId,    setPidConfigId]    = useState('');
  const [modelId,        setModelId]        = useState('');
  const [timestepSeconds,setTimestepSeconds]= useState(60);
  const [iterations,     setIterations]     = useState(100);

  const { data: pidConfigs } = useQuery(
    ['pidConfigs', room?.id],
    () => getPIDConfigs(room.id),
    { enabled: !!room }
  );
  const { data: models } = useQuery(
    ['models', room?.id],
    () => getModels(room.id),
    { enabled: !!room }
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      controllerType,
      timestepSeconds: Number(timestepSeconds),
      iterations:      Number(iterations)
    };

    if (controllerType === 'PID')      data.pidConfigId = Number(pidConfigId);
    if (controllerType === 'PID_LSTM') {
      data.pidConfigId = Number(pidConfigId);
      data.modelId     = Number(modelId);
    }
    if (controllerType === 'RL') data.modelId = Number(modelId);

    onCreate(data);
  };

  if (!room) return null;

  return (
    <form onSubmit={handleSubmit} className="border p-2 rounded bg-gray-50">
      <div className="grid grid-cols-2 gap-2 mb-2">

        {}
        <div>
          <label className="block text-sm">Тип контролера:</label>
          <select
            value={controllerType}
            onChange={(e) => setControllerType(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="PID">PID</option>
            <option value="PID_LSTM">PID + LSTM</option>
            <option value="RL">RL-агент</option>
          </select>
        </div>

        {}
        <div>
          <label className="block text-sm">Шаг, сек:</label>
          <input
            type="number" min="1"
            className="w-full border rounded px-2 py-1"
            value={timestepSeconds}
            onChange={(e) => setTimestepSeconds(e.target.value)}
            required
          />
        </div>

        {}
        <div>
          <label className="block text-sm">Ітерації:</label>
          <input
            type="number" min="1"
            className="w-full border rounded px-2 py-1"
            value={iterations}
            onChange={(e) => setIterations(e.target.value)}
            required
          />
        </div>

        {}
        {(controllerType === 'PID' || controllerType === 'PID_LSTM') && (
          <div className="col-span-2">
            <label className="block text-sm">PID configuration:</label>
            <select
              value={pidConfigId}
              onChange={(e) => setPidConfigId(e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">Choose PID config…</option>
              {pidConfigs?.map(cfg => {
                const label = `${cfg.tunedMethod || 'Manual'} `
                  + `(Kp=${cfg.kp ?? 0}, Ki=${cfg.ki ?? 0}, Kd=${cfg.kd ?? 0})`;
                return (
                  <option key={cfg.id} value={cfg.id} title={label}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {}
        {(controllerType === 'PID_LSTM' || controllerType === 'RL') && (
          <div>
            <label className="block text-sm">AI-модель:</label>
            <select
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">Оберіть модель</option>
              {models?.map((m) => {
                const modelLabel = `${m.id} (${m.type})`;
                return (
                  <option key={m.id} value={m.id} title={modelLabel}>
                    {modelLabel}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      {/* кнопки */}
      <div className="flex space-x-2">
        <Button type="submit">Запустити</Button>
      </div>
    </form>
  );
};

export default SimulationForm;