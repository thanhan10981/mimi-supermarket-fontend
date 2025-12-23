import { Button, InputNumber, List } from "antd";
import type { CartItem } from "./pos.types";


interface Props {
  cart: CartItem[];
  onQtyChange: (id: number, qty: number) => void;
}

export default function CartPanel({ cart, onQtyChange }: Props) {
  const totalQty = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce(
    (s, i) => s + i.quantity * i.price,
    0
  );

  return (
    <div
      style={{
        width: 420,
        padding: 16,
        borderRight: "1px solid #eee",
      }}
    >
      <h3>Hóa đơn 1</h3>

      <List
        dataSource={cart}
        renderItem={(item) => (
          <List.Item>
            <div style={{ flex: 1 }}>
              <div>{item.name}</div>
              <strong>{item.price.toLocaleString()} đ</strong>
            </div>

            <InputNumber
              min={1}
              value={item.quantity}
              onChange={(v: any) =>
                onQtyChange(item.id, Number(v))
              }
            />
          </List.Item>
        )}
      />

      <div style={{ marginTop: 16 }}>
        <p>Số lượng: <b>{totalQty}</b></p>
        <p>
          Tổng tiền hàng:{" "}
          <b>{totalPrice.toLocaleString()} đ</b>
        </p>
      </div>

      <Button
        type="primary"
        size="large"
        block
        style={{ marginTop: 16 }}
      >
        THANH TOÁN
      </Button>
    </div>
  );
}
