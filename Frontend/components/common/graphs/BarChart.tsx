"use client";

import React, { useMemo } from "react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type BarChartProps = {
  labels: string[];
  dataValues: number[];
  title?: string;
};

const BarChart: React.FC<BarChartProps> = ({ labels, dataValues, title }) => {
  // format data for recharts
  const data = useMemo(
    () =>
      labels.map((label, i) => ({
        name: label,
        value: dataValues[i],
      })),
    [labels, dataValues]
  );

  return (
    <div className="w-full">
      {title && <div className="mb-2 font-semibold">{title}</div>}
      <ResponsiveContainer width="100%" height={300}>
        <ReBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          barCategoryGap="20%" // 👈 no gap between bars, they stretch full width
          barGap="10%" // 👈 no gap between bars, they stretch full width
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={false} />
          <YAxis domain={[0, 100]} tickFormatter={(val: number) => `${val}%`} />
          <Tooltip
            formatter={(value: number) => [`Completion Rate: ${value}%`, ""]}
            labelFormatter={(label: string) => label}
          />
          <Bar dataKey="value" fill="rgba(75, 192, 192, 0.6)" />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
