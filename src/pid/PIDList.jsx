import React, { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppContext } from '../context/AppContext';
import { getPIDConfigs, setPIDActive, autoTune } from '../api/pid';
import Button from '../ui/Button';

const PIDList = () => {
  const { room } = useContext(AppContext);
  const queryClient = useQueryClient();
  const roomId = room ? room.id : null;

  const { data: configs, isLoading, isError, error } = useQuery(
    ['pidConfigs', roomId],
    () => getPIDConfigs(roomId),
    { enabled: !!roomId }
  );

  const { mutate: activatePID } = useMutation(
    ({ configId }) => setPIDActive(roomId, configId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pidConfigs', roomId]);
      }
    }
  );

  const { mutate: autoTuneMutate, isLoading: isTuning } = useMutation(
    () => autoTune(roomId),
    {
      onSuccess: () => {
        // Автотюн может добавить/обновить конфигурации, перезагрузим список
        queryClient.invalidateQueries(['pidConfigs', roomId]);
      }
    }
  );

  if (!room) return null;
  if (isLoading) return <p>Загрузка PID конфигураций...</p>;
  if (isError) return <p className="text-red-500">Ошибка: {error.message}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">PID-конфигурации</h3>
        <Button onClick={() => autoTuneMutate()} disabled={isTuning}>
          {isTuning ? 'Тюнинг...' : 'Авто-тюнинг'}
        </Button>
      </div>
      {configs.length === 0 ? (
        <p>Конфигурации PID отсутствуют.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
          <tr className="text-left border-b">
            <th className="py-1">Kp</th>
            <th className="py-1">Ki</th>
            <th className="py-1">Kd</th>
            <th className="py-1">Метод</th>
            <th className="py-1">Активный</th>
          </tr>
          </thead>
          <tbody>
          {configs.map(cfg => (
            <tr key={cfg.id} className="border-b last:border-b-0">
              <td className="py-1">{cfg.kp}</td>
              <td className="py-1">{cfg.ki}</td>
              <td className="py-1">{cfg.kd}</td>
              <td className="py-1">{cfg.tunedMethod || '—'}</td>
              <td className="py-1">
                {cfg.isActive ? (
                  <span className="text-green-600 font-semibold">Активен</span>
                ) : (
                  <Button size="sm" onClick={() => activatePID({ configId: cfg.id })}>
                    Сделать активным
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

export default PIDList;
