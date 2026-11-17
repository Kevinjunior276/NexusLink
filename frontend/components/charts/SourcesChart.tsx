'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface SourcesChartProps {
    data: any[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/95 border border-white/10 p-2.5 rounded-xl backdrop-blur-md shadow-xl text-xs">
                <span className="text-slate-400 block mb-0.5">{payload[0].name}</span>
                <span className="font-semibold text-white font-mono">
                    {payload[0].value} <span className="text-slate-400 font-normal">soumissions</span>
                </span>
            </div>
        );
    }
    return null;
};

export default function SourcesChart({ data }: SourcesChartProps) {
    if (!data || data.length === 0 || data.every(d => d.value === 0)) {
        return (
            <div className="w-full h-64 flex flex-col items-center justify-center text-slate-500 text-xs">
                <div className="w-8 h-8 rounded-full border border-slate-700/60 flex items-center justify-center mb-2">
                    <span className="text-xs">0</span>
                </div>
                <span>Aucune soumission enregistrée</span>
            </div>
        );
    }

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => <span className="text-slate-300 text-xs">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
