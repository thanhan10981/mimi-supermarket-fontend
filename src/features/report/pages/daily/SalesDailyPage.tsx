import { useState } from "react";
import { Spin, Select, Row, Col } from "antd";
import { useSalesDaily } from "../../../../app/hooks/useSalesDaily";
import SalesDailyChart from "./SalesDailyChart";
import SalesDailyTopTable from "./SalesDailyTopTable";
import SalesDailyStats from "./SalesDailyStats";
import "../../css/daily/sales-daily.css";

export default function SalesDailyPage() {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(1);

  const monthStr = `${year}-${String(month).padStart(2, "0")}`;
  const { data, loading } = useSalesDaily(monthStr);

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data) return <div>Không có dữ liệu</div>;

  return (
    <div className="sales-daily-page">
      {/* ===== HEADER ===== */}
      <div className="page-header">
        <div>
          <h2>Báo cáo doanh thu ngày</h2>
          <p>Theo dõi doanh thu hàng ngày trong tháng</p>
        </div>

        <div className="filters">
          <Select
            value={month}
            onChange={setMonth}
            options={Array.from({ length: 12 }).map((_, i) => ({
              value: i + 1,
              label: `Tháng ${i + 1}`,
            }))}
          />

          <Select
            value={year}
            onChange={setYear}
            options={[2024, 2025, 2026].map(y => ({
              value: y,
              label: `Năm ${y}`,
            }))}
          />
        </div>
      </div>

      <SalesDailyStats
        summary={data.summary}
        totalDays={data.chart.length}
        />


      <SalesDailyChart data={data.chart} />

      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={12}>
          <SalesDailyTopTable
            title="Top 5 ngày doanh thu cao nhất"
            data={data.topHighest}
          />
        </Col>
        <Col span={12}>
          <SalesDailyTopTable
            title="Top 5 ngày doanh thu thấp nhất"
            data={data.topLowest}
          />
        </Col>
      </Row>
    </div>
  );
}
