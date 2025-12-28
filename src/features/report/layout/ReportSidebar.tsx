import { NavLink } from "react-router-dom";
import {
  BarChartOutlined,
  CalendarOutlined,
  FireOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { message, Modal } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import "./report-layout.css";

export default function ReportSidebar() {
  const handleSync = async () => {
    const month = dayjs().format("YYYY-MM"); // tháng hiện tại

    Modal.confirm({
      title: "Đồng bộ báo cáo",
      content: `Bạn có chắc muốn đồng bộ lại dữ liệu báo cáo tháng ${month}?`,
      okText: "Đồng bộ",
      cancelText: "Hủy",
      onOk: async () => {
        try {
        await axios.post(
          "http://127.0.0.1:8003/api/reports/sync/from-bills",
          { month }
        );


          message.success("Đồng bộ báo cáo thành công!");
        } catch {
          message.error("Đồng bộ thất bại!");
        }

      },
    });
  };

  return (
    <aside className="report-sidebar">
      <div className="sidebar-title">BÁO CÁO</div>

      {/* 🔄 NÚT ĐỒNG BỘ */}
      <div className="sidebar-item sync-btn" onClick={handleSync}>
        <SyncOutlined />
        Đồng bộ dữ liệu
      </div>

      <NavLink to="/admin/reports/sales-monthly" className="sidebar-item">
        <BarChartOutlined />
        Báo cáo doanh thu tháng
      </NavLink>

      <NavLink to="sales-daily" className="sidebar-item">
        <CalendarOutlined />
        Báo cáo doanh thu ngày
      </NavLink>

      <NavLink to="top-sales" className="sidebar-item">
        <FireOutlined />
        Báo cáo top món chạy
      </NavLink>
    </aside>
  );
}
