import React, { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppContext } from '../context/AppContext';
import { getModels, setModelActive } from '../api/models';
import Button from '../ui/Button';

const ModelList = () => {
  const { room } = useContext(AppContext);
  const qc       = useQueryClient();
  const roomId   = room?.id;

  /* ---------- fetch models ---------- */
  const { data: models = [], isLoading, isError, error } = useQuery(
    ['models', roomId],
    () => getModels(roomId),
    { enabled: !!roomId }
  );

  /* ---------- (не змінюємо) активація моделі ---------- */
  const { mutate: activateModel } = useMutation(
    ({ modelId }) => setModelActive(roomId, modelId),
    { onSuccess: () => qc.invalidateQueries(['models', roomId]) }
  );

  if (!room)        return null;
  if (isLoading)    return <p>Загрузка моделей…</p>;
  if (isError)      return <p className="text-red-500">Помилка: {error.message}</p>;

  return (
    <div>
      <h3 className="font-semibold mb-2">AI-моделі</h3>

      {models.length === 0 ? (
        <p>АІ-моделі відсутні.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
          <tr className="text-left border-b">
            <th className="py-1">Опис (description)</th>
            <th className="py-1">Тип</th>
            <th className="py-1"></th>
          </tr>
          </thead>
          <tbody>
          {models.map((m) => (
            <tr key={m.id} className="border-b last:border-b-0">
              <td className="py-1">{m.description}</td>
              <td className="py-1">{m.type}</td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ModelList;