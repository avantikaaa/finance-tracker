import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts";
const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
function BarGraph({data}) {
  for (var key in data) {
    data[key] = {
      "month" : months[data[key]._id],
      ...data[key]
    }
  }
  
  return (
    <div>
    {/* {console.log(months[data?.id])} */}
      <BarChart  width={440} height={200} data={data}>
  
        <Bar dataKey="amount" name={months[data?._id]} fill="#7B2CBF" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey= "month"/>
        <YAxis />
        <Tooltip />
      </BarChart>
    </div>
  );
}

export default BarGraph;
