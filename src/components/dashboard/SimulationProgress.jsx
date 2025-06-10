import React, {useEffect, useState} from "react";
import {Progress} from "../ui/progress";

export function SimulationProgress({ simulation }) {
    const [progress, setProgress] = useState(simulation.progress || 0);

    useEffect(() => {
        if (simulation.status !== "RUNNING") return;
        const interval = setInterval(async () => {
            const p = await API.getSimulationProgress(simulation.id);
            setProgress(p);
        }, 1000);
        return () => clearInterval(interval);
    }, [simulation]);

    return simulation.status === "RUNNING" ? (
        <div className="mb-2">
            <span>Прогресс симуляции: {progress}%</span>
            <Progress value={progress} className="w-full h-2 mt-1" />
        </div>
    ) : null;
}