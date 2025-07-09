import React, { useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppContext } from '../context/AppContext';
import { getSimulations, createSimulation } from '../api/simulations';
import SimulationForm   from './SimulationForm';
import SimulationGraph  from './SimulationGraph';
import Button           from '../ui/Button';
import RangeFilter      from '../ui/RangeFilter';

const SimulationList = () => {
  const { room }      = useContext(AppContext);
  const queryClient   = useQueryClient();

  const [showForm,     setShowForm]     = useState(false);
  const [openGraphIds, setOpenGraphIds] = useState([]);
  const [range,        setRange]        = useState({ page: 0, size: 0 });

  const roomId = room?.id ?? null;
  const { data: simulations = [], isLoading, isError, error } = useQuery(
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

  const handleOpenGraph  = (id) => !openGraphIds.includes(id) && setOpenGraphIds([...openGraphIds, id]);
  const handleCloseGraph = (id) => setOpenGraphIds(openGraphIds.filter(gid => gid !== id));

  if (!room)      return null;
  if (isLoading)  return <p>Загрузка симуляцій…</p>;
  if (isError)    return <p className="text-red-500">Помилка: {error.message}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-2 space-x-4">
        <h3 className="font-semibold">Симуляції</h3>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Відмінити' : 'Нова симуляція'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-4">
          <SimulationForm onCreate={startSim} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {simulations.length === 0 ? (
        <p>Симуляцій поки нема.</p>
      ) : (
        <table className="w-full text-sm mb-4">
          <thead>
          <tr className="text-left border-b">
            <th className="py-1">Тип контролера</th>
            <th className="py-1">Шаг</th>
            <th className="py-1">Ітерації</th>
            <th className="py-1">Статус</th>
            <th className="py-1">Дії</th>
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
                <Button size="sm" onClick={() => handleOpenGraph(sim.id)}>Графік</Button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}

      {openGraphIds.length > 0 && (
        <div className="mb-3">
          <RangeFilter range={range} onChange={setRange} />
        </div>
      )}

      {openGraphIds.map(id => {
        const sim = simulations.find(s => s.id === id);
        return sim && (
          <SimulationGraph
            key={id}
            simulation={sim}
            page={range.page || 0}
            size={range.size || 0}
            onClose={() => handleCloseGraph(id)}
          />
        );
      })}
    </div>
  );
};

export default SimulationList;