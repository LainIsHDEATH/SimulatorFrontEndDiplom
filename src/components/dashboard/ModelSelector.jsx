// --- Новый компонент: Список моделей и выбор модели ---
export function ModelSelector({ models, selectedModelId, onChange, label }) {
    return (
        <div className="flex items-center gap-2">
            <span>{label}:</span>
            <select
                className="border rounded p-2"
                value={selectedModelId || ""}
                onChange={e => onChange(e.target.value)}
            >
                <option value="">Последняя модель</option>
                {models.map(model => (
                    <option value={model.id} key={model.id}>
                        {model.name} ({model.type})
                    </option>
                ))}
            </select>
        </div>
    );
}