// MainLayout.tsx
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";

const { Header, Content } = Layout;

export default function MainLayout({ showHeader = true }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {showHeader && (
        <Header
          style={{
            padding: 0,
            height: 56,        
            lineHeight: "56px",
            background: "transparent", 
          }}
        >
          <AppHeader />
        </Header>
      )}

      <Content style={{ background: "#f5f5f5" }}>
        <Outlet />
      </Content>
    </Layout>
  );
}
