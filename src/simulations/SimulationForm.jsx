import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { getPIDConfigs } from '../api/pid';
import { getModels } from '../api/models';
import Button from '../ui/Button';

const SimulationForm = ({ onCreate, onCancel }) => {
  const { room } = useContext(AppContext);
  const [controllerType, setControllerType] = useState('PID');
  const [pidConfigId, setPidConfigId] = useState('');
  const [modelId, setModelId] = useState('');
  const [timestep, setTimestep] = useState(1);
  const [iterations, setIterations] = useState(100);

  // Получаем конфиги PID и модели для заполнения выпадающих списков
  const { data: pidConfigs } = useQuery(
    ['pidConfigs', room.id],
    () => getPIDConfigs(room.id),
    { enabled: !!room }
  );
  const { data: models } = useQuery(
    ['models', room.id],
    () => getModels(room.id),
    { enabled: !!room }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { controllerType, timestep: Number(timestep), iterations: Number(iterations) };
    if (controllerType === 'PID') {
      data.pidConfigId = pidConfigId;
    } else if (controllerType === 'AI') {
      data.modelId = modelId;
    }
    onCreate(data);
  };

  if (!room) return null;

  return (
    <form onSubmit={handleSubmit} className="border p-2 rounded bg-gray-50">
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="block text-sm">Тип контроллера:</label>
          <select
            value={controllerType}
            onChange={(e) => setControllerType(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="PID">PID</option>
            <option value="AI">AI-модель</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Время шага:</label>
          <input
            type="number"
            min="1"
            className="w-full border rounded px-2 py-1"
            value={timestep}
            onChange={(e) => setTimestep(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Итерации:</label>
          <input
            type="number"
            min="1"
            className="w-full border rounded px-2 py-1"
            value={iterations}
            onChange={(e) => setIterations(e.target.value)}
            required
          />
        </div>
        {controllerType === 'PID' && (
          <div>
            <label className="block text-sm">PID конфиг:</label>
            <select
              value={pidConfigId}
              onChange={(e) => setPidConfigId(e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">Выбрать конфигурацию</option>
              {pidConfigs && pidConfigs.map(cfg => (
                <option key={cfg.id} value={cfg.id}>
                  {cfg.tunedMethod || 'Manual'} (Kp={cfg.kp})
                </option>
              ))}
            </select>
          </div>
        )}
        {controllerType === 'AI' && (
          <div>
            <label className="block text-sm">AI-модель:</label>
            <select
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">Выбрать модель</option>
              {models && models.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.type})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <Button type="submit">Запустить</Button>
        {onCancel && <Button type="button" onClick={onCancel}>Отмена</Button>}
      </div>
    </form>
  );
};

export default SimulationForm;
