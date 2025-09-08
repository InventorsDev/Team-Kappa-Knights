"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type BarChartProps = {
  labels: string[];
  dataValues: number[];
  title?: string;
};

const BarChart = ({ labels, dataValues, title }: BarChartProps) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Completion Rate (%)",
        data: dataValues,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: !!title,
        text: title,
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            // Show full label in tooltip
            return context[0].label;
          },
          label: (context) => {
            return `Completion Rate: ${context.formattedValue}%`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          display: false, // 🚫 hide long labels on x-axis
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => value + "%",
        },
      },
    },
    animation: {
      duration: 1200,
      easing: "easeOutBounce",
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
