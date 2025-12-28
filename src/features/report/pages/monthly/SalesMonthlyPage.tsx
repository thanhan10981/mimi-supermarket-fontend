import { useState } from "react";
import { Select, Spin } from "antd";
import StatsPanel from "./StatsPanel";
import SalesMonthlyChart from "./SalesMonthlyChart";
import SalesMonthlyTable from "./SalesMonthlyTable";
import { useSalesMonthly } from "../../../../app/hooks/useSalesMonthly";
import "../../css/sales-monthly.css";

const YEAR_OPTIONS = [2022, 2023, 2024, 2025];

export default function SalesMonthlyPage() {
  const [year, setYear] = useState<number>(2025);
  const { data, loading } = useSalesMonthly(year);

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return <div style={{ padding: 24 }}>Không có dữ liệu</div>;
  }

  return (
    <div className="sales-monthly-page">

      {/* ===== HEADER ===== */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Báo cáo doanh thu tháng</h2>
          <p className="page-desc">
            Thống kê doanh thu theo từng tháng trong năm
          </p>
        </div>

        <Select
          value={year}
          onChange={setYear}
          className="year-select"
          options={YEAR_OPTIONS.map(y => ({
            label: `Năm ${y}`,
            value: y,
          }))}
        />
      </div>

      {/* ===== SUMMARY ===== */}
      {data.summary && <StatsPanel summary={data.summary} />}

      {/* ===== CHART ===== */}
      {Array.isArray(data.chart) && data.chart.length > 0 && (
        <div className="section">
          <SalesMonthlyChart data={data.chart} />
        </div>
      )}

      {/* ===== TABLE ===== */}
      {Array.isArray(data.table) && data.table.length > 0 && (
        <div className="section">
          <SalesMonthlyTable data={data.table} />
        </div>
      )}
    </div>
  );
}
