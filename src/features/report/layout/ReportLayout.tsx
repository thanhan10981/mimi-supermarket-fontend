import { Outlet } from "react-router-dom";
import ReportSidebar from "./ReportSidebar";
import "./report-layout.css";

export default function ReportLayout() {
  return (
    <div className="report-layout">
      <ReportSidebar />
      <div className="report-main">
        <Outlet />
      </div>
    </div>
  );
}
