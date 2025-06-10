import {Card, CardContent} from "../ui/card";
import {Button} from "../ui/button";
import React from "react";

export function SimulationList({ simulations, selectedSimulation, onSelect }) {
    return (
        <Card className="mb-4">
            <CardContent>
                <div className="mb-2 font-semibold">Симуляции:</div>
                <div className="flex gap-2 flex-wrap">
                    {simulations.map(sim => (
                        <Button
                            key={sim.id}
                            variant={selectedSimulation?.id === sim.id ? "default" : "outline"}
                            onClick={() => onSelect(sim)}
                        >
                            {sim.name} {sim.status === "RUNNING" ? "(Выполняется)" : ""}
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}