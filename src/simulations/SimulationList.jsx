import React, { useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppContext } from '../context/AppContext';
import { getSimulations, createSimulation} from '../api/simulations';
import SimulationForm from './SimulationForm';
import SimulationGraph from './SimulationGraph';
import Button from '../ui/Button';
import RangeFilter from '../ui/RangeFilter';

const SimulationList = () => {
  const { room } = useContext(AppContext);
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [openGraphIds, setOpenGraphIds] = useState([]);
  const [range, setRange] = useState({ page: 0, size: 0 });   // 0 = «весь ряд»

  const roomId = room ? room.id : null;
  const { data: simulations, isLoading, isError, error } = useQuery(
    ['simulations', roomId],
    () => getSimulations(roomId),
    { enabled: !!roomId }
  );

  const { mutate: startSim } = useMutation(
    (simData) => createSimulation(roomId, simData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['simulations', roomId]);
        setShowForm(false);
      }
    }
  );

  const handleOpenGraph = (simId) => {
    if (!openGraphIds.includes(simId)) {
      setOpenGraphIds([...openGraphIds, simId]);
    }
  };

  const handleCloseGraph = (simId) => {
    setOpenGraphIds(openGraphIds.filter(id => id !== simId));
  };

  if (!room) return null;
  if (isLoading) return <p>Загрузка симуляций...</p>;
  if (isError) return <p className="text-red-500">Ошибка: {error.message}</p>;

  return (
    <div>
      {/* ───────────── Верхняя панель ───────────── */}
      <div className="flex justify-between items-center mb-2 space-x-4">
        <h3 className="font-semibold">Симуляции</h3>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Отмена' : 'Новая симуляция'}
        </Button>
      </div>

      {/* --- RangeFilter: сверху, если форма скрыта --- */}
      {!showForm && (
        <RangeFilter range={range} onChange={setRange}/>
      )}

      {showForm && (
        <div className="mb-4">
          <SimulationForm onCreate={startSim} onCancel={() => setShowForm(false)} />
        </div>
      )}


      {/* --- RangeFilter: снизу, если форма показана --- */}
      {showForm && (
        <div className="mb-2">
          <RangeFilter range={range} onChange={setRange}/>
        </div>
      )}

      {simulations.length === 0 ? (
        <p>Симуляций пока нет.</p>
      ) : (
        <table className="w-full text-sm mb-4">
          <thead>
          <tr className="text-left border-b">
            <th className="py-1">Тип контроллера</th>
            <th className="py-1">Шаг</th>
            <th className="py-1">Итерации</th>
            <th className="py-1">Статус</th>
            <th className="py-1">Действия</th>
          </tr>
          </thead>
          <tbody>
          {simulations.map(sim => (
            <tr key={sim.id} className="border-b last:border-b-0">
              <td className="py-1">{sim.controllerType}</td>
              <td className="py-1">{sim.timestepSeconds}</td>
              <td className="py-1">{sim.iterations}</td>
              <td className="py-1">{sim.status}</td>
              <td className="py-1">
                <Button size="sm" onClick={() => handleOpenGraph(sim.id)}>График</Button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}

      {/* Панели графиков для выбранных симуляций */}
      {openGraphIds.map(simId => {
        const sim = simulations.find(s => s.id === simId);
        return sim && (
          <SimulationGraph
            key={simId}
            simulation={sim}
            page={range.page || 0}
            size={range.size   || 0}
            onClose={() => handleCloseGraph(simId)}
          />
        );
      })}
    </div>
  );
};

export default SimulationList;
