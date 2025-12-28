import type { TopSaleSummary } from "../../monthly/topSale";

// ===== PROPS =====
interface TopSaleFooterProps {
  month: number | string;
  year: number | string;
  summary: TopSaleSummary;
}

export default function TopSaleFooter({
  month,
  year,
  summary,
}: TopSaleFooterProps) {
  return (
    <div className="top-sale-footer">
      <p>Dữ liệu được cập nhật theo tháng {month}/{year}</p>

      <div className="totals">
        <div>
          Tổng món: <b>{summary.totalQuantity}</b>
        </div>
        <div>
          Tổng doanh thu: <b>{summary.totalRevenue}</b>
        </div>
      </div>
    </div>
  );
}
