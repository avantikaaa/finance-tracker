import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts';

function DoubleGraphData({ data }) {
  return (
    <BarChart width={440} height={200} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="Expected_expense" fill="#7B2CBF" />
      <Bar dataKey="True_expense" fill="#E0AAFF" />
    </BarChart>
  );
}

export default DoubleGraphData;