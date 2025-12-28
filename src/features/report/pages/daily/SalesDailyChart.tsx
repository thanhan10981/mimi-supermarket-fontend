import { Card } from "antd";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { SalesDailyChartItem } from "../../monthly/salesDaily";
import "../../css/daily/sales-daily-chart.css";

interface SalesDailyChartProps {
  data: SalesDailyChartItem[];
}

export default function SalesDailyChart({
  data,
}: SalesDailyChartProps) {
  return (
    <Card
      title="Biểu đồ doanh thu theo ngày"
      className="sales-daily-chart"
    >
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data}>
          {/* gradient fill */}
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tickFormatter={(value: string) => {
              const day = parseInt(value.split("/")[0], 10);
              return day % 2 === 0 ? value : "";
            }}
          />

          <YAxis
            tickFormatter={(value: number) => `${value / 1_000_000}M`}
          />

            <Tooltip
            formatter={(value) => {
                if (typeof value !== "number") return value;
                return [`${value.toLocaleString()} đ`, "Doanh thu"];
            }}
            />


          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#14b8a6"
            strokeWidth={2}
            fill="url(#revenueGradient)"
            dot={false}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
