import React, { useState, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppContext } from '../context/AppContext';
import { createRlModel } from '../api/models';
import Button from '../ui/Button';

const RlModelForm = () => {
  const { room } = useContext(AppContext);
  const qc       = useQueryClient();

  const [iterations,      setIterations]      = useState(100_000);
  const [timestepSeconds, setTimestepSeconds] = useState(60);
  const [lr,    setLr]    = useState(0.3);
  const [gamma, setGamma] = useState(0.99);
  const [eps,   setEps]   = useState(1.0);

  const { mutate: createModel, isLoading, error } = useMutation(
    () => createRlModel(room.id, { iterations, timestepSeconds, lr, gamma, eps}),
    {
      onSuccess: () => {
        qc.invalidateQueries(['models', room.id]);
        setIterations(100_000);
        setTimestepSeconds(60);
        setLr(0.3);
        setGamma(0.99);
        setEps(1.0);
      },
    }
  );

  const submit = (e) => {
    e.preventDefault();
    if (!room) return;
    createModel();
  };

  if (!room) return null;

  return (
    <form onSubmit={submit} className="space-y-4">
      <h3 className="font-semibold text-lg">Створити RL-модель</h3>

      {error && <p className="text-red-500 text-sm">{error.message}</p>}

      <div className="grid grid-cols-2 gap-3">

        <label className="flex flex-col text-sm">
          <span className="mb-0.5 text-gray-700">Iterations (steps)</span>
          <input
            type="number"
            min="1"
            placeholder="iterations"
            className="border rounded px-2 py-1"
            value={iterations}
            onChange={(e) => setIterations(Number(e.target.value))}
            required
          />
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-0.5 text-gray-700">Timestep, seconds</span>
          <input
            type="number"
            min="1"
            placeholder="timestep, s"
            className="border rounded px-2 py-1"
            value={timestepSeconds}
            onChange={(e) => setTimestepSeconds(Number(e.target.value))}
            required
          />
        </label>


        <label className="flex flex-col text-sm">
          <span className="mb-0.5 text-gray-700">LR (α)</span>
          <input
            type="number"
            step="0.001"
            min="0"
            max="1"
            className="border rounded px-2 py-1"
            value={lr}
            onChange={(e) => setLr(Number(e.target.value))}
            required
          />
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-0.5 text-gray-700">γ (discount)</span>
          <input
            type="number"
            step="0.001"
            min="0"
            max="1"
            className="border rounded px-2 py-1"
            value={gamma}
            onChange={(e) => setGamma(Number(e.target.value))}
            required
          />
        </label>

        {/* eps */}
        <label className="flex flex-col text-sm">
          <span className="mb-0.5 text-gray-700">ε (exploration)</span>
          <input
            type="number"
            step="0.001"
            min="0"
            max="1"
            className="border rounded px-2 py-1"
            value={eps}
            onChange={(e) => setEps(Number(e.target.value))}
            required
          />
        </label>

      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Створення…' : 'Створити RL-модель'}
      </Button>
    </form>
  );
};

export default RlModelForm;