import React from 'react';
import {
    BarChart as ReBarChart,
    PieChart as RePieChart,
    LineChart as ReLineChart,
    Bar,
    Pie,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Pie Chart Component
export const PieChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </RePieChart>
        </ResponsiveContainer>
    );
};

// Bar Chart Component
export const BarChart = ({ data, colors = COLORS }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <ReBarChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill={colors[0]} />
            </ReBarChart>
        </ResponsiveContainer>
    );
};

// Line Chart Component
export const LineChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <ReLineChart
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Legend />
                {data.map((series, index) => (
                    <Line
                        key={series.name}
                        type="monotone"
                        dataKey="y"
                        data={series.data}
                        name={series.name}
                        stroke={COLORS[index % COLORS.length]}
                        activeDot={{ r: 8 }}
                    />
                ))}
            </ReLineChart>
        </ResponsiveContainer>
    );
};