export interface ChartDataPoint {
  date: string;
  month?: string;
  value: number;
  isHighlighted?: boolean;
}

export interface ParticipationChartProps {
  data?: ChartDataPoint[];
}
