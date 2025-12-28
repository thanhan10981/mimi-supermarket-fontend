import { Card } from "antd";
import type { SalesDailyTopItem } from "../../monthly/salesDaily";
import "../../css/daily/sales-daily-top-table.css";

interface SalesDailyTopTableProps {
  title: string;
  data: SalesDailyTopItem[];
}
export default function SalesDailyTopTable({
  title,
  data,
}: SalesDailyTopTableProps) {

  const type =
    title.includes("cao") ? "success" : "danger";

  return (
    <Card title={title}>
      <div className="top-day-list">
        {data.map((item) => (
          <div
            key={item.rank}
            className={`top-day-item ${type}`}
          >
            <div className="rank">{item.rank}</div>

            <div className="date">
              <div>{item.date}</div>
              <small>{item.orders} đơn hàng</small>
            </div>

            <div className="revenue">
              {item.revenue.toLocaleString()} đ
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
