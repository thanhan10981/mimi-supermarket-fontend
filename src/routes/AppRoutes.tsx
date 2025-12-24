import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import POSPage from "../features/pos/POSPage";
import Product from "../features/product/product";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Trang mặc định */}
      <Route path="/" element={<Navigate to="/admin/productSale" />} />

      {/* Layout posSell */}
      <Route path="/admin" element={<MainLayout showHeader={false}  />}>
        {/* POS */}
        <Route path="productSale" element={<POSPage />} />
      </Route>

      <Route path="/admin" element={<MainLayout showHeader/>}>
        {/* Product / Inventory */}
        <Route path="products" element={<Product />} />
      </Route>
    </Routes>
  );
}
