import { useEffect, useState } from "react";
import { LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,Legend } from "recharts";
import { API } from "../../api";

export default function ChartsArea({ simIds }) {
    const [dataById,setData] = useState({}); // {simId: data[]}

    /* Загружаем данные для новых симуляций */
    useEffect(()=>{
        simIds.forEach(id=>{
            if(dataById[id]) return;
            API.getSimulationData(id).then(d=>setData(prev=>({...prev,[id]:d})));
        });
    },[simIds,dataById]);

    return(
        <div className="grid gap-4"
             style={{gridTemplateColumns:`repeat(${simIds.length}, minmax(0,1fr))`}}>
            {simIds.map(id=>(
                <ChartCard key={id} data={dataById[id]||[]} />
            ))}
        </div>
    );
}

function ChartCard({ data }) {
    if(data.length===0) return <div className="h-80 bg-gray-50 rounded shadow"/>;

    return (
        <div className="bg-white p-3 rounded shadow">
            <LineChart width={400} height={250} data={data}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="step"/>
                <YAxis yAxisId="left"/>
                <YAxis yAxisId="right" orientation="right"/>
                <Tooltip/><Legend/>
                <Line yAxisId="left"  type="monotone" dataKey="temp"  stroke="#8884d8" dot={false}/>
                <Line yAxisId="right" type="monotone" dataKey="power" stroke="#82ca9d" dot={false}/>
            </LineChart>
        </div>
    );
}