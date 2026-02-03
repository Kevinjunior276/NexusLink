'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ActivityChartProps {
    data: any[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#03040b]/90 border border-white/10 p-3 rounded-xl backdrop-blur-md shadow-xl">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-sm font-black text-brand-primary">
                    {payload[0].value} <span className="text-[10px] font-medium text-white/50 ml-1">Soumissions</span>
                </p>
            </div>
        );
    }
    return null;
};

export default function ActivityChart({ data }: ActivityChartProps) {
    return (
        <div className="w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0070f3" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#0070f3" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="rgba(255,255,255,0.2)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="rgba(255,255,255,0.2)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#0070f3"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorCount)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
