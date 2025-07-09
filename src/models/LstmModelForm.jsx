import React, { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppContext }   from '../context/AppContext';
import { createLstmModel } from '../api/models';
import { getSimulations }  from '../api/simulations';
import Button              from '../ui/Button';

const LstmModelForm = () => {
  const { room }      = useContext(AppContext);
  const roomId        = room?.id;
  const queryClient   = useQueryClient();

  /* -------------------- локальний state форми -------------------- */
  const [form, setForm] = useState({
    simulationId  : '',
    HIDDEN_SIZE   : 128,
    NUM_LAYERS    : 2,
    SEQ_LENGTH    : 30,
    batch_size    : 64,
    epochs_number : 1,
  });
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  /* -------------------- список симуляцій кімнати -------------------- */
  const { data: simulations = [] } = useQuery(
    ['simulations', roomId],
    () => getSimulations(roomId),
    { enabled: !!roomId }
  );

  /* -------------------- відправка на бекенд -------------------- */
  const { mutate: train, isLoading, error } = useMutation(
    () => createLstmModel({
      roomId,
      simulationId  : Number(form.simulationId),
      HIDDEN_SIZE   : Number(form.HIDDEN_SIZE),
      NUM_LAYERS    : Number(form.NUM_LAYERS),
      SEQ_LENGTH    : Number(form.SEQ_LENGTH),
      batch_size    : Number(form.batch_size),
      epochs_number : Number(form.epochs_number),
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['models', roomId]);
        setForm({ ...form, simulationId: '' });          // повертаємо форму у початковий стан
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!room) return;
    train();
  };

  if (!room) return null;

  const labels = {
    HIDDEN_SIZE   : 'Hidden size (units)',
    NUM_LAYERS    : 'Number of layers',
    SEQ_LENGTH    : 'Sequence length',
    batch_size    : 'Batch size',
    epochs_number : 'Epochs',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="font-semibold">Train new LSTM model</h3>

      {error && <p className="text-red-500 text-sm">{error.message}</p>}

      {/* ---------- вибір симуляції ---------- */}
      <label className="flex flex-col text-sm">
        <span className="mb-1 text-gray-700">Training simulation</span>
        <select
          className="w-full border rounded px-2 py-1"
          value={form.simulationId}
          onChange={update('simulationId')}
          required
        >
          <option value="">— choose simulation —</option>
          {simulations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.controllerType} (id&nbsp;{s.id}, status&nbsp;{s.status})
            </option>
          ))}
        </select>
      </label>

      {/* ---------- гіперпараметри ---------- */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {Object.entries(labels).map(([key, lbl]) => (
          <label key={key} className="flex flex-col text-sm">
            <span className="mb-1 text-gray-700">{lbl}</span>
            <input
              className="w-full border rounded px-2 py-1"
              type="number"
              min="1"
              value={form[key]}
              onChange={update(key)}
              required
            />
          </label>
        ))}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Training…' : 'Train LSTM'}
      </Button>
    </form>
  );
};

export default LstmModelForm;