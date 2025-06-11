import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ResizableBox } from 'react-resizable';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getSimulationData } from '../api/simulations';
import Checkbox from '../ui/Checkbox';
// Не забудьте импортировать стили для ресайза (например, в index.jsx):
// import 'react-resizable/css/styles.css';

const SimulationGraph = ({ simulation, onClose }) => {
  const simId = simulation.id;
  const { data: simData, isLoading, isError, error } = useQuery(
    ['simulationData', simId],
    () => getSimulationData(simId)
  );
  // Стейт для выбранных полей графика
  const [selectedFields, setSelectedFields] = useState([]);

  if (isLoading) {
    return <p>Загрузка данных симуляции...</p>;
  }
  if (isError) {
    return <div className="relative p-4 border"><p className="text-red-500">Ошибка загрузки данных: {error.message}</p></div>;
  }
  if (!simData || simData.length === 0) {
    return <div className="relative p-4 border"><p>Нет данных для отображения.</p><button onClick={onClose}>×</button></div>;
  }

  // Определяем доступные поля (кроме временного шага)
  const allKeys = Object.keys(simData[0]);
  // Предполагаем, что 'iteration' (или 'time') - ось X
  let xKey = 'iteration';
  if (!allKeys.includes('iteration')) {
    xKey = allKeys.includes('time') ? 'time' : 'index';
    if (xKey === 'index') {
      // добавляем индекс как поле, если нет явного времени
      simData = simData.map((d, i) => ({ index: i, ...d }));
    }
  }
  const valueKeys = allKeys.filter(key => key !== xKey);

  // Инициализация выбранных полей при первом рендере
  if (selectedFields.length === 0) {
    setSelectedFields(valueKeys);
  }

  const handleToggleField = (field) => {
    setSelectedFields(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  // Цвета для линий (d3-схема Category10)
  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

  return (
    <div className="relative mb-4 border rounded p-4 bg-white">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold">График симуляции {simId} ({simulation.controllerType})</h4>
        <button onClick={onClose} className="text-xl font-bold text-gray-500 hover:text-gray-700">×</button>
      </div>
      <ResizableBox width={600} height={300} minConstraints={[300, 200]} maxConstraints={[1000, 600]}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={simData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            {selectedFields.map((field, index) => (
              <Line
                key={field}
                type="monotone"
                dataKey={field}
                stroke={colors[index % colors.length]}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ResizableBox>
      {/* Чекбоксы для выбора отображаемых параметров */}
      <div className="mt-2 flex flex-wrap items-center">
        {valueKeys.map(field => (
          <Checkbox
            key={field}
            label={field}
            checked={selectedFields.includes(field)}
            onChange={() => handleToggleField(field)}
            className="mr-4 mb-1"
          />
        ))}
      </div>
    </div>
  );
};

export default SimulationGraph;
