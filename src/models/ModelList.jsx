import React, { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppContext } from '../context/AppContext';
import { getModels, setModelActive } from '../api/models';
import Button from '../ui/Button';

const ModelList = () => {
  const { room } = useContext(AppContext);
  const queryClient = useQueryClient();
  const roomId = room ? room.id : null;

  const { data: models, isLoading, isError, error } = useQuery(
    ['models', roomId],
    () => getModels(roomId),
    { enabled: !!roomId }
  );

  const { mutate: activateModel } = useMutation(
    ({ modelId }) => setModelActive(roomId, modelId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['models', roomId]);
      }
    }
  );

  if (!room) return null;
  if (isLoading) return <p>Загрузка моделей...</p>;
  if (isError) return <p className="text-red-500">Ошибка: {error.message}</p>;

  return (
    <div>
      <h3 className="font-semibold mb-2">AI-модели</h3>
      {models.length === 0 ? (
        <p>Нет моделей.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
          <tr className="text-left border-b">
            <th className="py-1">Название</th>
            <th className="py-1">Тип</th>
            <th className="py-1">Активная</th>
          </tr>
          </thead>
          <tbody>
          {models.map(model => (
            <tr key={model.id} className="border-b last:border-b-0">
              <td className="py-1">{model.name}</td>
              <td className="py-1">{model.type}</td>
              <td className="py-1">
                {model.isActive ? (
                  <span className="text-green-600 font-semibold">Активна</span>
                ) : (
                  <Button size="sm" onClick={() => activateModel({ modelId: model.id })}>
                    Сделать активной
                  </Button>
                )}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ModelList;
