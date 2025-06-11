import { useState } from "react";
import { API } from "../../api";

export function RoomTree({ room, simulations, pidConfigs, models,
                             onSimulationClick, onRefresh }) {
    /* Новый запуск */
    const [ctrlType,setCtrl] = useState("PID");
    const [pidId,setPidId]   = useState("");
    const [modelId,setModel] = useState("");
    const [iters,setIters]   = useState(100000);
    const [dt,setDt]         = useState(1);

    const launch = async ()=>{
        await API.launchSimulation(room.id,{
            controllerType:ctrlType,
            pidConfigId: pidId || undefined,
            modelId: modelId || undefined,
            iterationsRequested: iters,
            timestep: dt
        });
        onRefresh();
    };

    return (
        <div className="space-y-4">
            {/* PID-конфиги */}
            <div className="bg-white p-3 rounded shadow">
                <h4 className="font-semibold">PID-конфиг</h4>
                <select className="w-full border rounded p-1 mt-1"
                        value={pidId} onChange={e=>setPidId(e.target.value)}>
                    <option value="">—</option>
                    {pidConfigs.map(c=>(
                        <option key={c.id} value={c.id}>
                            {`kp=${c.kp} ki=${c.ki} kd=${c.kd}`}
                        </option>
                    ))}
                </select>
                {/* кнопка autotune */}
                <button className="mt-1 text-xs underline"
                        onClick={async()=>{
                            await API.autotunePID(room.id);
                            onRefresh();
                        }}>
                    автотюнинг Cohen–Coon
                </button>
            </div>

            {/* ML-модели */}
            <div className="bg-white p-3 rounded shadow">
                <h4 className="font-semibold">Модели</h4>
                {["LSTM","RL"].map(t=>(
                    <div key={t} className="mb-2">
                        <div className="text-sm">{t}</div>
                        <select className="w-full border rounded p-1"
                                value={modelId} onChange={e=>setModel(e.target.value)}>
                            <option value="">Последняя</option>
                            {models.filter(m=>m.type===t).map(m=>(
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                        <button className="text-xs underline"
                                onClick={async()=>{
                                    t==="LSTM"
                                        ? await API.trainLSTM(room.id, simulations[0]?.id)
                                        : await API.trainRL(room.id);
                                    onRefresh();
                                }}>
                            {t==="LSTM" ? "обучить на симуляции" : "обучить RL"}
                        </button>
                    </div>
                ))}
            </div>

            {/* Запуск симуляции */}
            <div className="bg-white p-3 rounded shadow space-y-2">
                <h4 className="font-semibold">Новая симуляция</h4>
                <select className="w-full border rounded p-1"
                        value={ctrlType} onChange={e=>setCtrl(e.target.value)}>
                    <option>PID</option><option>PID+LSTM</option><option>RL</option>
                </select>
                <input className="w-full border rounded p-1"
                       type="number" placeholder="iterations" value={iters}
                       onChange={e=>setIters(+e.target.value)}/>
                <input className="w-full border rounded p-1"
                       type="number" placeholder="dt (сек)" value={dt}
                       onChange={e=>setDt(+e.target.value)}/>
                <button className="w-full bg-blue-600 text-white py-1 rounded"
                        onClick={launch}>
                    Запустить
                </button>
            </div>

            {/* Существующие симуляции */}
            <div className="bg-white p-3 rounded shadow">
              <h4 className="font-semibold mb-1">Симуляции</h4>
              {simulations.length === 0 && <p className="text-sm text-gray-500">Нет симуляций</p>}
              {simulations.map(s => (
                <button
                  key={s.id}
                  className="block w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => onSimulationClick(s)}
                >
                  {s.name}
                </button>
              ))}
            </div>
        </div>
    );
}