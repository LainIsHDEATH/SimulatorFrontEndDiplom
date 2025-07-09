import React, { useState, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppContext } from '../context/AppContext';
import { createPIDConfig } from '../api/pid';
import Button from '../ui/Button';

const PIDForm = () => {
  const { room } = useContext(AppContext);
  const queryClient = useQueryClient();
  const [kp, setKp] = useState('');
  const [ki, setKi] = useState('');
  const [kd, setKd] = useState('');

  const { mutate: createPID, isLoading, error } = useMutation(
    (cfg) => createPIDConfig(room.id, cfg),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pidConfigs', room.id]);
        setKp(''); setKi(''); setKd('');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!room) return;
    createPID({ kp: parseFloat(kp), ki: parseFloat(ki), kd: parseFloat(kd), tunedMethod: 'Manual' });
  };

  if (!room) return null;

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-semibold mb-2">Додати PID-конфігурацію вручну (Manual)</h3>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
      <div className="flex items-center space-x-2 mb-2">
        <input
          type="number" step="0.1" placeholder="Kp"
          className="border rounded px-2 py-1 w-20"
          value={kp} onChange={(e) => setKp(e.target.value)} required
        />
        <input
          type="number" step="0.1" placeholder="Ki"
          className="border rounded px-2 py-1 w-20"
          value={ki} onChange={(e) => setKi(e.target.value)} required
        />
        <input
          type="number" step="0.1" placeholder="Kd"
          className="border rounded px-2 py-1 w-20"
          value={kd} onChange={(e) => setKd(e.target.value)} required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Збереження...' : 'Додати'}
        </Button>
      </div>
    </form>
  );
};

export default PIDForm;
