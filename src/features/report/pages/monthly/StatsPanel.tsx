import { Card, Col, Row } from "antd";
import {
  DollarOutlined,
  BarChartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import type { SalesMonthlySummary } from "../../monthly/type";
import "../../css/sales-monthlypanel.css";

export default function StatsPanel({
  summary,
}: {
  summary?: SalesMonthlySummary;
}) {
  if (!summary) return null;

  return (
    <Row gutter={16} className="stats-panel">
      <Col span={6}>
        <Card className="stat-card blue">
          <div className="stat-header">
            <span>Tổng doanh thu</span>
            <div className="stat-icon">
              <DollarOutlined />
            </div>
          </div>
          <div className="stat-value">
            {summary.totalRevenue.toLocaleString()} đ
          </div>
          <div className="stat-sub">Cả năm</div>
        </Card>
      </Col>

      <Col span={6}>
        <Card className="stat-card green">
          <div className="stat-header">
            <span>Doanh thu TB / tháng</span>
            <div className="stat-icon">
              <BarChartOutlined />
            </div>
          </div>
          <div className="stat-value">
            {summary.avgRevenue.toLocaleString()} đ
          </div>
          <div className="stat-sub">Trung bình</div>
        </Card>
      </Col>

      <Col span={6}>
        <Card className="stat-card orange">
          <div className="stat-header">
            <span>Tổng đơn hàng</span>
            <div className="stat-icon">
              <ShoppingCartOutlined />
            </div>
          </div>
          <div className="stat-value">
            {summary.totalOrders.toLocaleString()}
          </div>
          <div className="stat-sub">Trong năm</div>
        </Card>
      </Col>
    </Row>
  );
}
