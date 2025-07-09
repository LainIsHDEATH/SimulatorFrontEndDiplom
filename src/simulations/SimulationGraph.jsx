import React, { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ResizableBox } from 'react-resizable';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { getSimulationDataPage, getSimulationMetrics } from '../api/simulations';
import Checkbox from '../ui/Checkbox';

const SimulationGraph = ({ simulation, onClose, page = 0, size = 0 }) => {
  const simId = simulation.id;
  const dashedFields = ['tempOut', 'predictedTemp'];

  const { data: rawData = [], isLoading, isError, error } = useQuery(
    ['simulationData', simId, page, size],
    () => getSimulationDataPage(simId, page, size),
    { enabled: !!simId }
  );

  const { data: metrics, isSuccess: metricsReady } = useQuery(
    ['metrics', simId],
    () => getSimulationMetrics(simId),
    { enabled: !!simId }
  );

  const { chartData, xKey } = useMemo(() => {
    let data = rawData;
    let xKey = 'iteration';
    if (data.length && data[0] && !data[0].hasOwnProperty(xKey)) {
      if (data[0].hasOwnProperty('time')) xKey = 'time';
      else {
        xKey = 'index';
        data = data.map((d, i) => ({ index: i, ...d }));
      }
    }
    return { chartData: data, xKey };
  }, [rawData]);

  const valueKeys = useMemo(() => {
    if (chartData.length === 0) return [];
    return Object.keys(chartData[0]).filter(
      (k) => k !== xKey && !['simulationId', 'timestamp', 'index'].includes(k)
    );
  }, [chartData, xKey]);

  const [selectedFields, setSelectedFields] = useState([]);
  useEffect(() => {
    if (selectedFields.length === 0 && valueKeys.length > 0) {
      setSelectedFields(valueKeys);
    }
  }, [selectedFields.length, valueKeys]);

  const isOnlyPower =
    selectedFields.length === 1 &&
    selectedFields[0].toLowerCase().includes('power');

  // Divide power values by 100 for display (e.g., 500 W -> 5)
  const processedData = useMemo(() => {
    if (chartData.length === 0) return [];
    const powerKeys = valueKeys.filter((k) => k.toLowerCase().includes('power'));
    return chartData.map((d) => {
      const entry = { ...d };
      powerKeys.forEach((pk) => {
        if (entry[pk] != null) {
          entry[pk] = entry[pk] / 100;
        }
      });
      return entry;
    });
  }, [chartData, valueKeys]);

  const xTicks = useMemo(() => {
    if (processedData.length === 0) return [];
    const vals = processedData.map((d) => d[xKey]);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const hours = 60;
    const span = max - min;
    const step = Math.ceil(span / (5 * hours)) * hours || hours;
    const start = Math.ceil(min / hours) * hours;
    const ticks = [];
    for (let t = start; t <= max; t += step) ticks.push(t);
    return ticks;
  }, [processedData, xKey]);

  if (isLoading) return <p>Загрузка даних симуляції...</p>;
  if (isError)
    return (
      <div className="relative p-4 border">
        <p className="text-red-500">Помилка загрузки даних: {error.message}</p>
      </div>
    );
  if (!processedData.length)
    return (
      <div className="relative p-4 border">
        <p>Дані для відображення відсутні</p>
        <button onClick={onClose}>×</button>
      </div>
    );

  const handleToggleField = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const colors = [
    '#000000', // чорний
    '#00008B', // темно-синій
    '#8B4513',  // коричневий
    '#2ca02c',
    '#700005',
    '#7f7f7f',
  ];

  return (
    <div className="relative mb-4 border rounded p-4 bg-white">
      <div className="text-center font-semibold mb-2">
        {isOnlyPower ? 'Heater Power (×0.01)' : 'Temperature'}
      </div>
      {metricsReady && (
        <table className="text-sm mb-2">
          <tbody>
          <tr>
            <td>MAE</td>
            <td>{metrics.mae.toFixed(2)} °C</td>
          </tr>
          <tr>
            <td>MSE</td>
            <td>{metrics.mse.toFixed(2)} °C</td>
          </tr>
          <tr>
            <td>RMSE</td>
            <td>{metrics.rmse.toFixed(2)} °C</td>
          </tr>
          <tr>
            <td>Енергія</td>
            <td>{metrics.energyKWh.toFixed(2)} кВт·год</td>
          </tr>
          <tr>
            <td>Перерегулювання</td>
            <td>{metrics.overshoot.toFixed(2)} °C</td>
          </tr>
          <tr>
            <td>Час врегулювання</td>
            <td>
              {metrics.settlingTimeS < 0
                ? '—'
                : metrics.settlingTimeS.toFixed(1) + ' с'}
            </td>
          </tr>
          </tbody>
        </table>
      )}
      <ResizableBox
        width={600}
        height={300}
        minConstraints={[300, 200]}
        maxConstraints={[1000, 600]}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={processedData}
            margin={{ top: isOnlyPower ? 20 : 40, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
            <XAxis
              dataKey={xKey}
              ticks={xTicks}
              tickFormatter={(v) => `${Math.round(v / 1440)}`}
              tickLine={false}
              label={{ value: 'Days', position: 'insideBottomRight', offset: -10 }}
            />
            <YAxis
              tickLine={false}
              label={{
                value: isOnlyPower ? 'Power (W/100)' : 'Temperature (°C)',
                angle: -90,
                position: 'insideLeft',
                offset: 0,
              }}
            />
            <Tooltip
              formatter={(value, name) => [
                name.toLowerCase().includes('power')
                  ? `${value.toFixed(2)}`
                  : value,
                name,
              ]}
            />
            {isOnlyPower ? (
              <Legend layout="vertical" align="left" verticalAlign="middle" />
            ) : (
              <Legend verticalAlign="top" align="right" />
            )}
            {selectedFields.map((field, idx) => {
              const isDashed = field === 'tempOut';
              const isDashed2 = field === 'predictedTemp';
              return (
                <Line
                  key={field}
                  type="monotone"
                  dataKey={field}
                  stroke={colors[idx % colors.length]}
                  strokeWidth={2}
                  dot={false}
                  name={field}
                  // если поле есть в dashedFields — делаем штрихи 5px через 5px
                  strokeDasharray={isDashed ? '2 4' : undefined}
                  strokeDasharray2={isDashed2 ? '5 5' : undefined}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </ResizableBox>
      <div className="mt-2 flex flex-wrap items-center">
        {valueKeys.map((field) => (
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