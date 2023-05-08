import React, {useEffect, useState, memo} from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { CustomTooltip } from "./CustomToolTip";

const PieRechartComponent = ({pieData})=>{
   const COLORS = ['#9D4EDD', '#7B2CBF', '#3C096C', 'purple', "#6a74b7", "#8a7c93"];
   return (
      <PieChart width={440} height={200}>
      <Pie
         data={pieData}
         color="#000000"
         valueKey="amount"
         nameKey="_id"
         cx="30%"
         cy="50%"
         outerRadius={80}
         fill="#8884d8"
      >
         {pieData?.map((entry, index) => (
            <Cell
               key={`cell-${index}`}
               fill={COLORS[index % COLORS.length]}
            />
         ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
      <Legend layout="vertical" align="right"/>
      </PieChart>
      );
}
export default memo(PieRechartComponent);