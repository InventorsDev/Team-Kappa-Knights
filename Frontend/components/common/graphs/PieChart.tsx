"use client";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type PieChartProps = {
  labels: string[];
  dataValues: number[];
  title?: string;
};

const PieChart = ({ labels, dataValues, title }: PieChartProps) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Count",
        data: dataValues,
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)", // green for completed
          "rgba(255, 205, 86, 0.6)", // yellow for in-progress
          "rgba(201, 203, 207, 0.6)", // gray for not-started
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(201, 203, 207, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: !!title,
        text: title,
      },
    },
    animation: {
      animateRotate: true, // ✅ rotates pie in
      animateScale: true, // ✅ zooms in from center
      duration: 1200, // speed of animation
      easing: "easeOutBounce", // fun easing
    },
  };

  return <Pie data={data} options={options} />;
};

export default PieChart;
