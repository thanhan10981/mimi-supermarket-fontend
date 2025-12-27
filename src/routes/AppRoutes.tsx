import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Product from "../features/product/product";
import POS from "../features/pos/POS";
import Bill from "../features/bill/bill";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/productSale" />} />

      <Route path="/admin" element={<MainLayout />}>
        <Route path="productSale" element={<POS />} />
        <Route path="products" element={<Product />} />
        <Route path="bill" element={<Bill />} />
      </Route>
    </Routes>
  );
}
