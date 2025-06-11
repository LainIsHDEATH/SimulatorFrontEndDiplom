import { useState } from "react";
import { API } from "../../api";
export default function NewRoomForm({ userId, onCreated }) {
  const [name, setName] = useState("");
  const [json, setJson] = useState("");
  const save = async (e) => {
    e.preventDefault();
    userId = 1;
    const created = await API.createRoom(userId, {
      name,
      roomParams: JSON.parse(json)}
    );
    // добавляем новую комнату в список
    setName("");
    setJson("");
    onCreated(created);
    // onCreated();
  };
    return(
        <form onSubmit={save} className="space-y-2 bg-gray-50 p-4 border rounded">
            <h3 className="font-semibold">Новая комната</h3>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Название"
                   className="w-full border p-1 rounded" required/>
            <textarea value={json} onChange={e=>setJson(e.target.value)} placeholder='{"volume":45,"surfaces":[]}'
                      rows={4} className="w-full border p-1 rounded font-mono" required/>
            <button className="bg-green-600 text-white px-3 py-1 rounded">Сохранить</button>
        </form>
    );
}