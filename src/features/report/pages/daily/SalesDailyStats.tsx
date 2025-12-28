import { Card, Col, Row } from "antd";
import {
  DollarOutlined,
  CalendarOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { SalesDailySummary } from "../../monthly/salesDaily";
import "../../css/daily/sales-daily-stats.css";

interface SalesDailyStatsProps {
  summary: SalesDailySummary;
  totalDays: number;
}

export default function SalesDailyStats({
  summary,
  totalDays,
}: SalesDailyStatsProps) {
  return (
    <Row gutter={16} className="sales-daily-stats">
      <Col span={6}>
        <Card className="daily-card green">
          <div className="daily-header">
            <span>Tổng doanh thu</span>
            <div className="daily-icon">
              <DollarOutlined />
            </div>
          </div>
          <div className="daily-value">
            {summary.totalRevenue.toLocaleString()} đ
          </div>
          <div className="daily-sub">Tháng hiện tại</div>
        </Card>
      </Col>

      <Col span={6}>
        <Card className="daily-card blue">
          <div className="daily-header">
            <span>Trung bình/ngày</span>
            <div className="daily-icon">
              <CalendarOutlined />
            </div>
          </div>
          <div className="daily-value">
            {summary.avgRevenue.toLocaleString()} đ
          </div>
          <div className="daily-sub">Doanh thu trung bình</div>
        </Card>
      </Col>

      <Col span={6}>
        <Card className="daily-card purple">
          <div className="daily-header">
            <span>Tổng đơn hàng</span>
            <div className="daily-icon">
              <ShoppingCartOutlined />
            </div>
          </div>
          <div className="daily-value">
            {summary.totalOrders.toLocaleString()}
          </div>
          <div className="daily-sub">Đơn trong tháng</div>
        </Card>
      </Col>

      <Col span={6}>
        <Card className="daily-card pink">
          <div className="daily-header">
            <span>Số ngày có doanh thu</span>
            <div className="daily-icon">
              <ClockCircleOutlined />
            </div>
          </div>
          <div className="daily-value">{totalDays}</div>
          <div className="daily-sub">Ngày</div>
        </Card>
      </Col>
    </Row>
  );
}
