import React, {useEffect, useState} from "react";
import {Card, CardContent} from "../ui/card";
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {API} from "../../api";

export function SimulationChart({ simulation }) {
    const [data, setData] = useState([]);
    useEffect(() => {
        if (!simulation) return;
        API.getSimulationData(simulation.id).then(setData);
    }, [simulation]);

    if (!simulation) return <div className="italic text-muted-foreground">Выберите симуляцию</div>;

    return (
        <Card>
            <CardContent>
                <div className="mb-2 font-semibold">График температуры и мощности</div>
                <LineChart width={700} height={320} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="step" label={{ value: "Шаг", position: "insideBottomRight", offset: -2 }} />
                    <YAxis yAxisId="left" label={{ value: "Температура", angle: -90, position: "insideLeft" }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: "Мощность", angle: 90, position: "insideRight" }} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#8884d8" name="Температура" dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="power" stroke="#82ca9d" name="Мощность" dot={false} />
                </LineChart>
            </CardContent>
        </Card>
    );
}