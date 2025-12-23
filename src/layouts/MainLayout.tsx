import { Layout, Input, Dropdown, Menu } from "antd";
import {
  SearchOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Outlet } from "react-router-dom";

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  return (
    <Layout style={{ height: "100vh" }}>
      {/* HEADER */}
      <Header
        style={{
          background: "#f5f5f5",
        padding: 16,
        minHeight: "calc(100vh - 64px)",
        }}
      >
        {/* Search */}
        <Input
          placeholder="Tìm hàng hóa"
          prefix={<SearchOutlined />}
          style={{ width: 280 }}
        />

        {/* Hóa đơn tab */}
        <div
          style={{
            background: "#fff",
            padding: "4px 12px",
            borderRadius: 6,
            fontWeight: 500,
          }}
        >
          Hóa đơn 1 ✕
        </div>

        <div style={{ flex: 1 }} />

        {/* User menu */}
        <Dropdown
          menu={{
            items: [
              { key: "1", label: "Tài khoản" },
              { key: "2", label: "Đăng xuất" },
            ],
          }}
        >
          <div style={{ color: "#fff", cursor: "pointer" }}>
            <UserOutlined /> Admin
          </div>
        </Dropdown>
      </Header>

      <Layout>
        {/* SIDEBAR */}
        <Sider width={200} theme="light">
          <Menu
            mode="inline"
            defaultSelectedKeys={["pos"]}
            items={[
              {
                key: "pos",
                icon: <MenuOutlined />,
                label: "Bán hàng",
              },
              {
                key: "product",
                label: "Sản phẩm",
              },
              {
                key: "order",
                label: "Đơn hàng",
              },
              {
                key: "report",
                label: "Báo cáo",
              },
            ]}
          />
        </Sider>

        {/* CONTENT */}
        <Content
          style={{
            background: "#f5f5f5",
            padding: 0,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
