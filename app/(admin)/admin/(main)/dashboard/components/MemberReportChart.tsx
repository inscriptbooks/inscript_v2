/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MemberReportChart() {
  const chartRef = useRef<ChartJS<"bar">>(null);
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
      barThickness: number;
      borderRadius: number;
    }>;
  }>({
    labels: [],
    datasets: [
      {
        label: "신규",
        data: [],
        backgroundColor: "#911A00",
        borderColor: "#911A00",
        borderWidth: 0,
        barThickness: 32,
        borderRadius: 0,
      },
    ],
  });

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/admin/dashboard/monthly-users`
        );
        if (response.ok) {
          const data = await response.json();
          setChartData({
            labels: data.map((item: { month: string }) => item.month),
            datasets: [
              {
                label: "신규",
                data: data.map((item: { count: number }) => item.count),
                backgroundColor: "#911A00",
                borderColor: "#911A00",
                borderWidth: 0,
                barThickness: 32,
                borderRadius: 0,
              },
            ],
          });
        }
      } catch (error) {
        // Error silently handled
      }
    };

    fetchMonthlyData();
  }, []);

  // 차트 데이터
  const data = chartData;

  // 차트 옵션
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // 범례는 별도 구성
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#911A00",
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          title: function (context: any) {
            return context[0].label;
          },
          label: function (context: any) {
            return `신규: ${context.parsed.y}명`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true, // x축 세로 격자 표시
          color: "#E5E7EB",
          lineWidth: 1,
          borderDash: [5, 5], // 점선 그리드
        },
        border: {
          display: true,
          color: "#E5E7EB",
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            size: 12,
          },
        },
      },
      y: {
        min: 0,
        max: 300,
        ticks: {
          stepSize: 50,
          color: "#9CA3AF",
          font: {
            size: 12,
          },
          callback: function (tickValue: any) {
            return tickValue;
          },
        },
        grid: {
          display: true,
          color: "#E5E7EB",
          lineWidth: 1,
          drawBorder: true,
          borderDash: [5, 5], // 점선 그리드
        },
        border: {
          display: true,
          color: "#E5E7EB",
        },
      },
    },
    elements: {
      bar: {
        borderSkipped: false,
      },
    },
    layout: {
      padding: {
        top: 10,
        bottom: 0,
        left: 0,
        right: 10,
      },
    },
  };

  return (
    <div className="flex flex-1 flex-col items-start self-stretch">
      <div className="flex h-[300px] w-full items-end justify-center">
        <Bar ref={chartRef} data={data} options={options} />
      </div>
      <div className="flex items-center justify-center self-stretch pt-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2" style={{ backgroundColor: "#911A00" }} />
          <span className="text-xs text-gray-3">신규</span>
        </div>
      </div>
    </div>
  );
}
