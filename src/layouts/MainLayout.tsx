import { Layout } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "./AppHeader";

const { Header, Content } = Layout;

export default function MainLayout() {
  const { pathname } = useLocation();

  // Ẩn header cho POS
  const hideHeader = pathname.startsWith("/admin/productSale");

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!hideHeader && (
        <Header
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            padding: 0,
            height: 56,
            background: "linear-gradient(90deg, #0b5ed7, #1677ff)",
          }}
        >
          <AppHeader />
        </Header>
      )}

      <Content
        style={{
          background: "#f5f5f5",
          paddingTop: hideHeader ? 0 : 56,
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
}
