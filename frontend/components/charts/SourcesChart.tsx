'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface SourcesChartProps {
    data: any[];
}

const COLORS = {
    'Orange Money': '#f97316', // Orange
    'MTN Money': '#eab308',    // Yellow
    'Wave Mobile': '#3b82f6',  // Blue
    'Virements': '#6366f1',    // Indigo
    'Autres': '#888888'        // Gray
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#03040b]/90 border border-white/10 p-3 rounded-xl backdrop-blur-md shadow-xl">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">{payload[0].name}</p>
                <p className="text-sm font-black text-white">
                    {payload[0].value} <span className="text-[10px] font-medium text-white/50 ml-1">Capture(s)</span>
                </p>
            </div>
        );
    }
    return null;
};

export default function SourcesChart({ data }: SourcesChartProps) {
    if (!data || data.length === 0 || data.every(d => d.value === 0)) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center opacity-20">
                    <div className="text-4xl mb-2">🥧</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest">Pas de données</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
