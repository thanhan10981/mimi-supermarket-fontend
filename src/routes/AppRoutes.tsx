import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Product from "../features/product/product";
import POS from "../features/pos/POS";
import SalesMonthlyPage from "../features/report/pages/monthly/SalesMonthlyPage";
import ReportLayout from "../features/report/layout/ReportLayout";
import SalesDailyPage from "../features/report/pages/daily/SalesDailyPage";
import TopSalePage from "../features/report/pages/topsale/TopSalePage";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/productSale" />} />

      <Route path="/admin" element={<MainLayout />}>
        <Route path="productSale" element={<POS />} />
        <Route path="products" element={<Product />} />

        <Route path="reports" element={<ReportLayout />}>
          <Route path="sales-monthly" element={<SalesMonthlyPage />} />
          <Route path="sales-daily" element={<SalesDailyPage />} />
          <Route path="top-sales" element={<TopSalePage />} />
        </Route>
      </Route>
    </Routes>

  );
}
