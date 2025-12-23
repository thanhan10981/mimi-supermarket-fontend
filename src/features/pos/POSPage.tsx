import { useState } from "react";
import { Layout } from "antd";
import type { CartItem, Product } from "./pos.types";
import ProductGrid from "./ProductGrid";
import CartPanel from "./CartPanel";


const { Content } = Layout;

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Lọc máy Toyota Vios",
    price: 500000,
    image: "/images/loc-may.png",
  },
  {
    id: 2,
    name: "Dầu nhớt Castrol 10W40",
    price: 200000,
    image: "/images/dau-nhot.png",
  },
  {
    id: 3,
    name: "Đĩa phanh",
    price: 300000,
    image: "/images/dia-phanh.png",
  },
];

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exist = prev.find((p) => p.id === product.id);
      if (exist) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQty = (id: number, qty: number) => {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: qty } : p
      )
    );
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Content style={{ display: "flex" }}>
        {/* Hóa đơn */}
        <CartPanel cart={cart} onQtyChange={updateQty} />

        {/* Danh sách sản phẩm */}
        <ProductGrid products={mockProducts} onAdd={addToCart} />
      </Content>
    </Layout>
  );
}
