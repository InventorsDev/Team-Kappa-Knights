// src/components/common/graphs/LineChart.tsx
"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart as ReChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type Dataset = {
  label: string;
  data: (number | null)[];
  borderColor?: string;
  backgroundColor?: string;
};

type LineChartProps = {
  labels: string[]; // ISO datetimes
  datasets: Dataset[];
  title?: string;
};

// moods ranked worst → best
const moodLabelsMap = [
  "frustrated",
  "stressed",
  "tired",
  "okay",
  "excited",
  "motivated",
];

const LineChart: React.FC<LineChartProps> = ({ labels, datasets, title }) => {
  // build array of { x: label, d0: number, d1: number, ... }
  const data = useMemo(() => {
    return labels.map((label, i) => {
      const point: Record<string, any> = { x: label };
      datasets.forEach((ds, idx) => {
        point[`d${idx}`] = ds.data[i] ?? null;
      });
      return point;
    });
  }, [labels, datasets]);

  // custom tooltip that translates numeric mood -> text
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;
    return (
      <div className="bg-white p-2 rounded shadow">
        <div className="font-semibold text-sm">
          {new Date(label).toLocaleString()}
        </div>
        {payload.map((p: any) => {
          const val = p.value;
          const moodText =
            typeof val === "number" ? moodLabelsMap[val] ?? val : val;
          return (
            <div key={p.dataKey} className="text-sm">
              <span className="mr-1">{p.name ?? p.dataKey}:</span>
              <strong>{moodText}</strong>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {title && <div className="mb-2 font-semibold">{title}</div>}
      <ResponsiveContainer width="100%" height={300}>
        <ReChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="x"
            tickFormatter={(val: string) => {
              const d = new Date(val);
              return d.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              });
            }}
            minTickGap={20}
          />
          <YAxis
            width={90}
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tickFormatter={(v: number) => moodLabelsMap[v as number] ?? v}
          />
          <Tooltip content={<CustomTooltip />} />
          {datasets.map((ds, idx) => (
            <Line
              key={idx}
              type="monotone"
              dataKey={`d${idx}`}
              name={ds.label}
              stroke={ds.borderColor ?? undefined}
              dot={true}
              activeDot={{ r: 5 }}
              connectNulls={false}
            />
          ))}
        </ReChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
