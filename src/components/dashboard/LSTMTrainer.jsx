// --- Кнопка обучения LSTM (доступна при выборе симуляции) ---
import {Button} from "../ui/button";
import {useState} from "react";
import {API} from "../../api";

export function LSTMTrainer({ room, simulation, onTrained }) {
    const [loading, setLoading] = useState(false);

    const handleTrain = async () => {
        setLoading(true);
        const model = await API.trainLSTM(room.id, simulation.id);
        setLoading(false);
        onTrained(model);
        alert("Модель LSTM обучена и сохранена для комнаты!");
    };

    if (!simulation) return null;

    return (
        <Button onClick={handleTrain} disabled={loading}>
            Обучить LSTM на этой симуляции
        </Button>
    );
}