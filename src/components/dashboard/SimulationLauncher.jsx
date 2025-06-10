// --- SimulationLauncher теперь поддерживает выбор модели ---
import {useState} from "react";
import {API} from "../../api";
import {Card, CardContent} from "../ui/card";
import {ModelSelector} from "./ModelSelector";
import {Button} from "../ui/button";

export function SimulationLauncher({ room, onLaunched, models, selectedModelId, setSelectedModelId }) {
    const [controller, setController] = useState("PID");
    const [loading, setLoading] = useState(false);

    const launch = async () => {
        setLoading(true);
        // Можно передать selectedModelId в backend, если выбран контроллер LSTM или RL
        const sim = await API.launchSimulation(room.id, controller, selectedModelId);
        setLoading(false);
        onLaunched(sim);
    };

    // Выбор модели только для PID+LSTM или RL
    const showModelSelect = controller === "PID+LSTM" || controller === "RL";

    return (
        <Card className="mb-4">
            <CardContent className="flex items-center gap-4 p-4">
                <span>Контроллер:</span>
                <select
                    className="border rounded p-2"
                    value={controller}
                    onChange={e => setController(e.target.value)}
                >
                    <option value="PID">PID</option>
                    <option value="PID+LSTM">PID + LSTM</option>
                    <option value="RL">RL Agent</option>
                </select>
                {showModelSelect && (
                    <ModelSelector
                        models={models.filter(m => (controller === "RL" ? m.type === "RL" : m.type === "LSTM"))}
                        selectedModelId={selectedModelId}
                        onChange={setSelectedModelId}
                        label="Модель"
                    />
                )}
                <Button onClick={launch} disabled={loading}>Запустить симуляцию</Button>
            </CardContent>
        </Card>
    );
}