import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { SalesMonthlyChartItem } from "../../monthly/type";
import { Card } from "antd";
import "../../css/sales-monthlychart.css"

export default function SalesMonthlyChart({ data }: { data: SalesMonthlyChartItem[] }) {
  return (
    <Card title="Doanh thu theo tháng" className="sales-card">

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="revenue" fill="#1677ff" radius={[6, 6, 0, 0]} />
        </BarChart>

      </ResponsiveContainer>
    </Card>
  );
}
