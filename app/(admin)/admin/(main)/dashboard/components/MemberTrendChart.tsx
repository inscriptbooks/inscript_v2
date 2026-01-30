/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function MemberTrendChart() {
  const chartRef = useRef<ChartJS<"line">>(null);
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      borderWidth: number;
      pointBackgroundColor: string;
      pointBorderColor: string;
      pointBorderWidth: number;
      pointRadius: number;
      pointHoverRadius: number;
      tension: number;
      fill: boolean;
    }>;
  }>({
    labels: [],
    datasets: [
      {
        label: "가입",
        data: [],
        borderColor: "#911A00",
        backgroundColor: "transparent",
        borderWidth: 2,
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: "#911A00",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      },
    ],
  });

  // 차트 준비 완료 시 그라데이션 생성
  useEffect(() => {
    const chart = chartRef.current;
    if (chart && chart.ctx) {
      const ctx = chart.ctx;

      // 그라데이션 생성
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, "rgba(145, 26, 0, 0.3)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      // 그라데이션을 데이터셋에 직접 적용
      if (chart.data.datasets[0]) {
        chart.data.datasets[0].backgroundColor = gradient;
        chart.update();
      }
    }
  }, [chartData]);

  // API에서 데이터 가져오기
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
                label: "누적",
                data: data.map((item: { count: number }) => item.count),
                borderColor: "#911A00",
                backgroundColor: "transparent",
                borderWidth: 2,
                pointBackgroundColor: "#FFFFFF",
                pointBorderColor: "#911A00",
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                tension: 0.4,
                fill: true,
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
            return `누적: ${context.parsed.y}명`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
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
        max: 200,
        ticks: {
          stepSize: 40,
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
      point: {
        hoverBackgroundColor: "#FFFFFF",
        hoverBorderColor: "#911A00",
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
      <div className="flex h-[300px] w-full items-center justify-center">
        <Line ref={chartRef} data={data} options={options} />
      </div>
      <div className="flex items-center justify-center self-stretch pt-4">
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-4" style={{ backgroundColor: "#911A00" }} />
          <div
            className="h-2 w-2 rounded-full border"
            style={{
              borderColor: "#911A00",
              backgroundColor: "#FFFFFF",
              borderWidth: "1px",
            }}
          />
          <span className="text-xs text-gray-3">누적</span>
        </div>
      </div>
    </div>
  );
}
