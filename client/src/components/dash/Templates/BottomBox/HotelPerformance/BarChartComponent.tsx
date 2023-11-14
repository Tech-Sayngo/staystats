import React from 'react';
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Area,
    ResponsiveContainer,
} from 'recharts';

function BarChartComponent(props: any) {
    return (
        <div style={{ height: '350px', overflow: 'auto' }}>
        <ResponsiveContainer width="100%" height={1500}>
            <ComposedChart data={props.chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis dataKey="source" type="category" />
                <XAxis type="number" />
                <Tooltip />
                <Legend />
                <Bar dataKey={props.type} fill="#8884d8" stroke="#006ef5" strokeWidth={3} barSize={60} />
            </ComposedChart>
        </ResponsiveContainer>
        </div>
    );
}

export default BarChartComponent;
