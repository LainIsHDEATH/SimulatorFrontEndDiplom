import React, { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {ResizableBox} from 'react-resizable';
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
import { getSimulationDataPage } from '../api/simulations';
import { getSimulationMetrics } from '../api/simulations';
import Checkbox from '../ui/Checkbox';
// Импорт стилей для ресайза:
// import 'react-resizable/css/styles.css';

const SimulationGraph = ({simulation, onClose, page = 0, size = 0}) => {
  const simId = simulation.id;

  /* ---------- постраничная подгрузка ---------- */
  const {data: rawData = [], isLoading, isError, error} = useQuery(
    ['simulationData', simId, page, size],
    () => getSimulationDataPage(simId, page, size),
    {enabled: !!simId}
  );

  /* ---------- отдельный useQuery для метрик ---------- */
  const {
    data: metrics,
    isSuccess: metricsReady,
  } = useQuery(
    ['metrics', simId],
    () => getSimulationMetrics(simId),
    { enabled: !!simId }
  );

  // Обработка данных и определение осей
  const {chartData, xKey} = useMemo(() => {
    let data = rawData;
    let xKey = 'iteration';
    if (data.length && data[0] && !data[0].hasOwnProperty(xKey)) {
      if (data[0].hasOwnProperty('time')) xKey = 'time';
      else {
        xKey = 'index';
        data = data.map((d, i) => ({index: i, ...d}));
      }
    }
    return {chartData: data, xKey};
  }, [rawData]);

  // Поля для отображения
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
    // зависит и от selectedFields.length, и от valueKeys
  }, [selectedFields.length, valueKeys]);

  // Определяем, если выбрано только поле мощности
  const isOnlyPower = selectedFields.length === 1 &&
    selectedFields[0].toLowerCase().includes('power');

  // Масштабируем power к диапазону температуры
  const processedData = useMemo(() => {
    if (chartData.length === 0) return [];
    const powerKeys = valueKeys.filter((k) => k.toLowerCase().includes('power'));
    const tempKeys = valueKeys.filter((k) => k.toLowerCase().includes('temp'));
    let data = chartData.map(d => ({...d}));
    if (powerKeys.length && tempKeys.length) {
      const pk = powerKeys[0];
      const tk = tempKeys[0];
      const temps = data.map((d) => d[tk]);
      const powers = data.map((d) => d[pk]);
      const minT = Math.min(...temps);
      const maxT = Math.max(...temps);
      const minP = Math.min(...powers);
      const maxP = Math.max(...powers);
      const factor = (maxT - minT) / (maxP - minP || 1);
      data = data.map((d) => ({
        ...d,
        [pk]: (d[pk] - minP) * factor + minT,
      }));
    }
    return data;
  }, [chartData, valueKeys]);

  // Тики X в днях
  const xTicks = useMemo(() => {
    if (processedData.length === 0) return [];
    const vals = processedData.map((d) => d[xKey]);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const day = 1440;
    const span = max - min;
    const step = Math.ceil(span / (5 * day)) * day || day;
    const start = Math.ceil(min / day) * day;
    const ticks = [];
    for (let t = start; t <= max; t += step) ticks.push(t);
    return ticks;
  }, [processedData, xKey]);

  if (isLoading) return <p>Загрузка данных симуляции...</p>;
  if (isError)
    return (
      <div className="relative p-4 border">
        <p className="text-red-500">Ошибка загрузки данных: {error.message}</p>
      </div>
    );
  if (!processedData.length)
    return (
      <div className="relative p-4 border">
        <p>Нет данных для отображения.</p>
        <button onClick={onClose}>×</button>
      </div>
    );

  const handleToggleField = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

  return (
    <div className="relative mb-4 border rounded p-4 bg-white">
      <div className="text-center font-semibold mb-2">
        {isOnlyPower ? 'Heater Power (scaled)' : 'Temperature'}
      </div>
      {/* ───────────  табличка метрик  ─────────── */}
      {metricsReady && (
        <table className="text-sm mb-2">
          <tbody>
          <tr><td>MAE</td><td>{metrics.mae.toFixed(2)} °C</td></tr>
          <tr><td>RMSE</td><td>{metrics.rmse.toFixed(2)} °C</td></tr>
          <tr><td>Енергія</td><td>{metrics.energyKWh.toFixed(2)} кВт·год</td></tr>
          <tr><td>Перерегулювання</td><td>{metrics.overshoot.toFixed(2)} °C</td></tr>
          <tr>
            <td>Час врегулювання</td>
            <td>
              {metrics.settlingTimeS < 0
                ? '—'
                : (metrics.settlingTimeS / 60).toFixed(1) + ' хв'}
            </td>
          </tr>
          </tbody>
        </table>
      )}
      <ResizableBox width={600} height={300} minConstraints={[300, 200]} maxConstraints={[1000, 600]}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={processedData} margin={{top: isOnlyPower ? 20 : 40, right: 30, left: 20, bottom: 20}}>
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3"/>
            <XAxis
              dataKey={xKey}
              ticks={xTicks}
              tickFormatter={(v) => `${Math.round(v / 1440)}`}
              tickLine={false}
              label={{value: 'Days', position: 'insideBottomRight', offset: -10}}
            />
            <YAxis
              tickLine={false}
              label={{
                value: isOnlyPower ? 'Power (scaled)' : 'Temperature (°C)',
                angle: -90,
                position: 'insideLeft',
                offset: 0,
              }}
            />
            <Tooltip
              formatter={(value, name) => [
                name.toLowerCase().includes('power') ? `${value.toFixed(1)} (scaled)` : value,
                name,
              ]}
            />
            {isOnlyPower ? (
              <Legend layout="vertical" align="left" verticalAlign="middle"/>
            ) : (
              <Legend verticalAlign="top" align="right"/>
            )}
            {selectedFields.map((field, idx) => (
              <Line
                key={field}
                type="monotone"
                dataKey={field}
                stroke={colors[idx % colors.length]}
                strokeWidth={2}
                dot={false}
                name={field}
              />
            ))}
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