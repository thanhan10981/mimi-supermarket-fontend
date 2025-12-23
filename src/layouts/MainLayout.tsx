import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5", // nền xám nhạt
        color: "#000",         // chữ đen
        padding: 20,
      }}
    >
      <h2>MainLayout OK</h2>
      <Outlet />
    </div>
  );
}
