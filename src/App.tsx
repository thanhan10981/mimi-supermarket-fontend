import { BrowserRouter, Routes, Route } from "react-router-dom";
import POS from "./features/pos/POS";
import Product from "./features/product/product";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<POS />} />
        <Route path="/product" element={<Product />} />
      </Routes>
    </BrowserRouter>
  );
}
