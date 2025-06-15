// src/components/PIDList.jsx
import React, { useContext, useState }   from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppContext }  from '../context/AppContext';
import { getPIDConfigs, setPIDActive }   from '../api/pid';
import { autoTunePid }                   from '../api/pid';
import Button        from '../ui/Button';

const PIDList = () => {
  const { room } = useContext(AppContext);
  const qc       = useQueryClient();
  const roomId   = room?.id;

  /* ---- локальные поля формы автотюна ---- */
  const [iterations,      setIter]   = useState(60);
  const [timestepSeconds, setStep]   = useState(60);
  const [method,          setMethod] = useState('CohenCoon');

  /* ---- загрузка существующих конфигов ---- */
  const { data: configs = [], isLoading, isError, error } =
    useQuery(['pidConfigs', roomId], () => getPIDConfigs(roomId), { enabled: !!roomId });

  /* ---- set active pid ---- */
  const { mutate: activatePID } = useMutation(
    ({ configId }) => setPIDActive(roomId, configId),
    { onSuccess: () => qc.invalidateQueries(['pidConfigs', roomId]) }
  );

  /* ---- автотюнинг ---- */
  const { mutate: runTune, isLoading: isTuning } = useMutation(
    () => autoTunePid(roomId, { iterations: +iterations, timestepSeconds: +timestepSeconds, method }),
    { onSuccess: () => qc.invalidateQueries(['pidConfigs', roomId]) }
  );

  if (!room)                return null;
  if (isLoading)            return <p>Загрузка PID-конфигураций…</p>;
  if (isError)              return <p className="text-red-500">Ошибка: {error.message}</p>;

  return (
    <div>
      {/* ---------- шапка списка ---------- */}
      <div className="flex flex-wrap items-end gap-3 mb-2">

        <h3 className="font-semibold mr-auto">PID-конфигурации</h3>

        {/* --- поля параметров автотюна --- */}
        <div className="flex items-center space-x-2 text-sm">
          <label>Iter</label>
          <input  type="number" min="10"  value={iterations}
                  onChange={e=>setIter(e.target.value)}   className="w-20 border rounded px-1" />
          <label>dt, s</label>
          <input  type="number" min="1"   value={timestepSeconds}
                  onChange={e=>setStep(e.target.value)}   className="w-20 border rounded px-1" />
          <select value={method} onChange={e=>setMethod(e.target.value)}
                  className="border rounded px-1">
            <option value="CohenCoon">Cohen-Coon</option>
            {/* будущие методы */}
          </select>
        </div>

        <Button onClick={runTune} disabled={isTuning}>
          {isTuning ? 'Тюнинг…' : 'Авто-тюнинг'}
        </Button>
      </div>

      {/* ---------- табличка конфигов ---------- */}
      {configs.length === 0 ? (
        <p>Конфигурации PID отсутствуют.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
          <tr className="text-left border-b">
            <th className="py-1">Kp</th><th>Ki</th><th>Kd</th>
            <th>Метод</th><th>Активный</th>
          </tr>
          </thead>
          <tbody>
          {configs.map(cfg => (
            <tr key={cfg.id} className="border-b last:border-b-0">
              <td>{cfg.kp}</td><td>{cfg.ki}</td><td>{cfg.kd}</td>
              <td>{cfg.tunedMethod||'—'}</td>
              <td>
                {cfg.isActive
                  ? <span className="text-green-600 font-semibold">Активен</span>
                  : <Button size="sm" onClick={()=>activatePID({configId: cfg.id})}>
                    Сделать активным
                  </Button>}
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
