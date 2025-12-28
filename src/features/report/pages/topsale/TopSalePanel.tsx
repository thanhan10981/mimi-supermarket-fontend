import { Card, Col, Row, Statistic } from "antd";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  TagOutlined,
} from "@ant-design/icons";
import type { TopSaleSummary } from "../../monthly/topSale";
import "../../css/topsale/top-salepanel.css"

export default function TopSalePanel({ summary }: { summary: TopSaleSummary }) {
  return (
    <Row gutter={16} className="top-sale-panel">
      <Col span={8}>
        <Card className="panel-card green">
          <div className="panel-icon"><DollarOutlined /></div>
          <Statistic
            title="Tổng doanh thu"
            value={summary.totalRevenue}
            suffix="đ"
          />
          <div className="panel-sub">Từ top 10 món bán chạy</div>
        </Card>
      </Col>

      <Col span={8}>
        <Card className="panel-card blue">
          <div className="panel-icon"><ShoppingCartOutlined /></div>
          <Statistic
            title="Tổng số lượng"
            value={summary.totalQuantity}
          />
          <div className="panel-sub">Món ăn đã bán</div>
        </Card>
      </Col>

      <Col span={8}>
        <Card className="panel-card purple">
          <div className="panel-icon"><TagOutlined /></div>
          <Statistic
            title="Giá trung bình"
            value={summary.avgPrice}
            suffix="đ"
          />
          <div className="panel-sub">Giá bán trung bình</div>
        </Card>
      </Col>
    </Row>
  );
}
