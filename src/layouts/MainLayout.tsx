import { Layout } from "antd";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

export default function MainLayout() {
  return (
    <Layout style={{ height: "100vh" }}>
      <Content style={{ height: "100%" }}>
        <Outlet />
      </Content>
    </Layout>
  );
}
