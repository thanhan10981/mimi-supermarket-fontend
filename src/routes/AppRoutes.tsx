import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import POSPage from "../features/pos/POSPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/productSale" />} />
      <Route path="/admin" element={<MainLayout />}>
        <Route path="productSale" element={<POSPage />} />
      </Route>
    </Routes>
  );
}
