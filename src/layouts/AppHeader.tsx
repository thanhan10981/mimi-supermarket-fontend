import { Button, Space } from "antd";
import {
  ShoppingCartOutlined,
  TeamOutlined,
  DollarOutlined,
  BarChartOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import "./AppHeader.css";
import { useNavigate } from "react-router-dom";

export default function AppHeader() {
    const navigate = useNavigate();
  return (
    <header className="app-header">
      <div className="app-header-left">
        <Space size={20}>
          <Button type="text" icon={<ShopOutlined />} onClick={() => navigate("/admin/products")}>
            Hàng hóa
          </Button>
          <Button type="text" icon={<DollarOutlined />}onClick={() => navigate("/admin/bill")}>
            Hóa đơn
          </Button>
          <Button type="text" icon={<TeamOutlined />}>
            Khách Hàng
          </Button>
          <Button type="text" icon={<BarChartOutlined />}>
            Báo cáo thống kê
          </Button>
        </Space>
      </div>

      <div className="app-header-right">
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          className="sell-btn"
          onClick={() => navigate("/admin/productSale")}
        >
          Bán hàng
        </Button>

        <img
          className="avatar"
          src=""
          alt="avatar"
        />
      </div>
    </header>
  );
}
