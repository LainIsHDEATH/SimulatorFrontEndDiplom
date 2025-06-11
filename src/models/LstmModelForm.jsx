import React, { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppContext } from '../context/AppContext';
import { createLstmModel } from '../api/models';
import { getSimulations } from '../api/simulations';
import Button from '../ui/Button';

const LstmModelForm = () => {
  const { room } = useContext(AppContext);
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [epochs, setEpochs] = useState(10);
  const [trainingSimId, setTrainingSimId] = useState('');

  // Получаем список симуляций для выбора обучающей
  const roomId = room ? room.id : null;
  const { data: simulations } = useQuery(
    ['simulations', roomId],
    () => getSimulations(roomId),
    { enabled: !!roomId }
  );

  const { mutate: createModel, isLoading, error } = useMutation(
    () => createLstmModel(roomId, { name, epochs, trainingSimId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['models', roomId]);
        setName('');
        setEpochs(10);
        setTrainingSimId('');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!room) return;
    createModel();
  };

  if (!room) return null;

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-semibold mb-2">Создать LSTM-модель</h3>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <input
            type="text"
            placeholder="Название модели"
            className="w-full border rounded px-2 py-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="number"
            min="1"
            placeholder="Epochs"
            className="w-full border rounded px-2 py-1"
            value={epochs}
            onChange={(e) => setEpochs(Number(e.target.value))}
            required
          />
        </div>
        <div className="col-span-2">
          <select
            className="w-full border rounded px-2 py-1"
            value={trainingSimId}
            onChange={(e) => setTrainingSimId(e.target.value)}
            required
          >
            <option value="">Выберите симуляцию для обучения</option>
            {simulations && simulations.map(sim => (
              <option key={sim.id} value={sim.id}>
                {sim.controllerType} (id: {sim.id}, статус: {sim.status})
              </option>
            ))}
          </select>
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Создание...' : 'Создать LSTM-модель'}
      </Button>
    </form>
  );
};

export default LstmModelForm;
