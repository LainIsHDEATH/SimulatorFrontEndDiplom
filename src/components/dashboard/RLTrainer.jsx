// --- Кнопка обучения RL (на экране комнаты) ---
import {useState} from "react";
import {API} from "../../api";
import {Button} from "../ui/button";

function RLTrainer({ room, onTrained }) {
    const [loading, setLoading] = useState(false);

    const handleTrain = async () => {
        setLoading(true);
        const model = await API.trainRL(room.id);
        setLoading(false);
        onTrained(model);
        alert("RL-модель обучена и сохранена для комнаты!");
    };

    return (
        <Button onClick={handleTrain} disabled={loading}>
            Обучить RL для этой комнаты
        </Button>
    );
}