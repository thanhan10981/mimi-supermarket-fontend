import { Select, Spin } from "antd";
import { useState } from "react";
import { useTopSale } from "../../../../app/hooks/useTopSale";
import TopSalePanel from "./TopSalePanel";
import TopSaleChart from "./TopSaleChart";
import TopSaleTable from "./TopSaleTable";
import TopSaleFooter from "./TopSaleFooter";
import "../../css/topsale/top-sale.css"

export default function TopSalePage() {
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(12);

  const monthStr = `${year}-${String(month).padStart(2, "0")}`;
  const { data, loading } = useTopSale(monthStr);

  if (loading) return <Spin />;

  if (!data) return null;

  return (
    <div className="top-sale-page">
      <div className="page-header">
        <h2>Báo cáo top món chạy</h2>
        <p>Xếp hạng sản phẩm theo doanh thu</p>

        <div className="filters">
          <Select value={month} onChange={setMonth} options={[...Array(12)].map((_,i)=>({value:i+1,label:`Tháng ${i+1}`}))}/>
          <Select value={year} onChange={setYear} options={[2024,2025].map(y=>({value:y,label:`Năm ${y}`}))}/>
        </div>
      </div>

      <TopSalePanel summary={data.summary} />
      <TopSaleChart bar={data.barChart} pie={data.pieChart} />
      <TopSaleTable data={data.table} />
      <TopSaleFooter month={month} year={year} summary={data.summary} />
    </div>
  );
}
