import { useEffect, useState } from "react";
import { API } from "../../api";
import NewRoomForm from "../rooms/NewRoomForm";
import { RoomTree } from "./RoomTree";
import ChartsArea from "./ChartsArea";

export default function Dashboard() {
    /* selected objects */
    const [user,setUser]         = useState(null);
    const [room,setRoom]         = useState(null);
    const [simulations,setSims]  = useState([]);
    const [pidConfigs,setPids]   = useState([]);
    const [models,setModels]     = useState([]);
    const [openedCharts,setCharts] = useState([]);             // массив simId

    /* загрузка пользователей */
    const [users,setUsers] = useState([]);
    useEffect(()=>{ API.getUsers().then(r=>setUsers(r.users ?? r)); },[]);

    /* при выборе пользователя — тянем его комнаты */
    const [rooms,setRooms] = useState([]);
    useEffect(()=>{
        if(!user) return;
        API.getRoomsByUser(user.id).then(r=>setRooms(r.roons ?? r));
    },[user]);

    /* при выборе комнаты — тянем её данные */
    useEffect(()=>{
        if(!room) return;
        API.getSimulations(room.id).then(setSims);
        API.getPidConfigs(room.id).then(r=>setPids(r.configs ?? r));
        API.getModels(room.id).then(r=>setModels(r.models ?? r));
    },[room]);

    const toggleChart = (sim) => {
        setCharts((prev)=>
            prev.includes(sim.id)?prev: [...prev,sim.id]);
    };

    return(
        <div className="grid grid-cols-12 gap-4">
            {/* Сайдбар */}
            <aside className="col-span-3 space-y-4">
                {/* 1. Пользователи */}
                <div className="p-4 bg-white rounded shadow">
                    <h3 className="font-semibold mb-2">Пользователи</h3>
                    {users.map(u=>(
                        <button key={u.id} className={`block w-full text-left px-2 py-1 rounded
                     ${user?.id===u.id?"bg-blue-600 text-white":"hover:bg-gray-100"}`}
                                onClick={()=>{setUser(u);setRoom(null)}}>
                            {u.username || u.email}
                        </button>
                    ))}
                </div>

                {/* 2. Комнаты выбранного пользователя */}
                {user && (
                    <>
                        <div className="p-4 bg-white rounded shadow">
                            <h3 className="font-semibold mb-2">Комнаты</h3>
                            {rooms.map(r=>(
                                <button key={r.id}
                                        className={`block w-full text-left px-2 py-1 rounded
                          ${room?.id===r.id?"bg-blue-500 text-white":"hover:bg-gray-100"}`}
                                        onClick={()=>setRoom(r)}>
                                    {r.name}
                                </button>
                            ))}
                        </div>

                        {/* Форма добавления новой комнаты */}
                        <NewRoomForm userId={user.id} onCreated={()=>API.getRoomsByUser(user.id).then(setRooms)} />
                    </>
                )}

                {/* 3. PID, ML-модели, Запуск симуляции */}
                {room && (
                    <RoomTree
                        room={room}
                        pidConfigs={pidConfigs}
                        models={models}
                        simulations={simulations}
                        onSimulationClick={toggleChart}
                        onRefresh={()=>{
                            API.getSimulations(room.id).then(setSims);
                            API.getPidConfigs(room.id).then(r=>setPids(r.configs??r));
                            API.getModels(room.id).then(r=>setModels(r.models??r));
                        }}
                    />
                )}
            </aside>

            {/* Центральная панель графиков */}
            <main className="col-span-9">
                <ChartsArea simIds={openedCharts} />
            </main>
        </div>
    );
}