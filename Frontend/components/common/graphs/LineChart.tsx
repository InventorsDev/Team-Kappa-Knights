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
  labels: string[]; // e.g. ["Jan", "Feb", "Mar"]
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
      tension: 0.3, // curve smoothness
      borderColor: ds.borderColor || "rgb(75, 192, 192)",
      backgroundColor: ds.backgroundColor || "rgba(75, 192, 192, 0.2)",
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" as const },
      title: {
        display: !!title,
        text: title,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
