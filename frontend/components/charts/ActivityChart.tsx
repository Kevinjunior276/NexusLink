'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ActivityChartProps {
    data: any[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/95 border border-white/10 p-3 rounded-xl backdrop-blur-md shadow-xl">
                <p className="text-[10px] font-medium text-slate-400 mb-1">{label}</p>
                <p className="text-sm font-semibold text-blue-400 font-mono">
                    {payload[0].value} <span className="text-xs font-normal text-slate-400">soumissions</span>
                </p>
            </div>
        );
    }
    return null;
};

export default function ActivityChart({ data }: ActivityChartProps) {
    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="rgba(255,255,255,0.3)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        dy={8}
                    />
                    <YAxis
                        stroke="rgba(255,255,255,0.3)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#2563eb"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorCount)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
