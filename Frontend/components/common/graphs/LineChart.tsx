"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type LineChartProps = {
  labels: string[]; // pass ISO strings like "2025-09-07T07:45:00Z"
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }[];
  title?: string;
};

const LineChart = ({ labels, datasets, title }: LineChartProps) => {
  const data = {
    labels,
    datasets: datasets.map((ds) => ({
      ...ds,
      fill: false,
      tension: 0.3,
      borderColor: ds.borderColor || "rgb(75, 192, 192)",
      backgroundColor: ds.backgroundColor || "rgba(75, 192, 192, 0.2)",
    })),
  };

  // moods ranked worst → best
  const moodLabelsMap = [
    "frustrated", // 0
    "stressed", // 1
    "tired", // 2
    "okay", // 3
    "excited", // 4
    "motivated", // 5
  ];

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { display: false, position: "top" },
      title: { display: !!title, text: title },
      tooltip: {
        callbacks: {
          label: (context) => {
            const moodIndex = context.parsed.y as number;
            const moodText = moodLabelsMap[moodIndex] ?? moodIndex;
            return `${context.dataset.label}: ${moodText}`;
          },
          title: (context) => {
            const idx = context[0].dataIndex;
            const date = new Date(labels[idx]); // now a valid ISO string
            return date.toLocaleString(undefined, {
              weekday: "short", // e.g. Sun
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { display: false }, // hide bottom labels
      },
      y: {
        ticks: {
          stepSize: 1,
          callback: (value) => moodLabelsMap[value as number] ?? value,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
