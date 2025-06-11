import React, { useState, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppContext } from '../context/AppContext';
import { createRlModel } from '../api/models';
import Button from '../ui/Button';

const RlModelForm = () => {
  const { room } = useContext(AppContext);
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [episodes, setEpisodes] = useState(100);

  const { mutate: createModel, isLoading, error } = useMutation(
    () => createRlModel(room.id, { name, episodes }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['models', room.id]);
        // Возможно запускается процесс обучения; обновление списка моделей по завершении
        setName('');
        setEpisodes(100);
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
      <h3 className="font-semibold mb-2">Создать RL-модель</h3>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <input
          type="text"
          placeholder="Название модели"
          className="border rounded px-2 py-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          min="1"
          placeholder="Эпизоды"
          className="border rounded px-2 py-1"
          value={episodes}
          onChange={(e) => setEpisodes(Number(e.target.value))}
          required
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Создание...' : 'Создать RL-модель'}
      </Button>
    </form>
  );
};

export default RlModelForm;
