import { useEffect, useState } from "react";
import "./POS.css";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Bill {
  id: number;
  name: string;
  cart: CartItem[];
}

const mockProducts: Product[] = [
  { id: 1, name: "Lọc máy Toyota Vios", price: 500000, image: "" },
  { id: 2, name: "Dầu nhớt Castrol 10W40", price: 200000, image: "" },
  { id: 3, name: "Đĩa phanh", price: 300000, image: "" },
  { id: 4, name: "Thanh giằng", price: 150000, image: "" },
  { id: 5, name: "Thanh giằng", price: 150000, image: "" },
  { id: 6, name: "Thanh giằng", price: 150000, image: "" },
  { id: 7, name: "Thanh giằng", price: 150000, image: "" },
  { id: 8, name: "Thanh giằng", price: 150000, image: "" },
  { id: 9, name: "Thanh giằng", price: 150000, image: "" },
  { id: 10, name: "Thanh giằng", price: 150000, image: "" },
  { id: 11, name: "Thanh giằng", price: 150000, image: "" },
  { id: 12, name: "Thanh giằng", price: 150000, image: "" },
];

export default function POS() {
  const navigate = useNavigate();

  const [bills, setBills] = useState<Bill[]>(() => {
  const saved = localStorage.getItem("pos_bills");
  return saved
    ? JSON.parse(saved)
    : [{ id: 1, name: "Hóa đơn 1", cart: [] }];
});



const [toast, setToast] = useState<string | null>(null);


  const [activeId, setActiveId] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank">("cash");
  const [customer, setCustomer] = useState<string | null>(null);
  const activeBill = bills.find((b) => b.id === activeId)!;

  const addBill = () => {
    const id = Date.now();
    setBills([...bills, { id, name: `Hóa đơn ${bills.length + 1}`, cart: [] }]);
    setActiveId(id);
  };


  const addToCart = (p: Product) => {
    setBills(
      bills.map((b) => {
        if (b.id !== activeId) return b;
        const exist = b.cart.find((i) => i.id === p.id);
        return {
          ...b,
          cart: exist
            ? b.cart.map((i) =>
                i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i
              )
            : [...b.cart, { ...p, quantity: 1 }],
        };
      })
    );
  };
const handleCheckout = () => {
  if (activeBill.cart.length === 0) {
    setToast("Vui lòng thêm sản phẩm trước khi thanh toán");
    return;
  }

  setShowCheckout(true);
};
  const totalQty = activeBill.cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = activeBill.cart.reduce(
    (s, i) => s + i.quantity * i.price,
    0
  );

const changeQty = (id: number, delta: number) => {
  setBills(prev =>
    prev.map(b =>
      b.id !== activeBill.id
        ? b
        : {
            ...b,
            cart: b.cart
              .map(i =>
                i.id === id
                  ? { ...i, quantity: i.quantity + delta }
                  : i
              )
              .filter(i => i.quantity > 0),
          }
    )
  );
};

const removeItem = (id: number) => {
  setBills(prev =>
    prev.map(b =>
      b.id !== activeBill.id
        ? b
        : { ...b, cart: b.cart.filter(i => i.id !== id) }
    )
  );
};
const closeBill = (id: number) => {
  setBills(prev => {
    if (prev.length === 1) return prev;

    const remain = prev.filter(b => b.id !== id);

    // 🔥 nếu xoá bill đang active
    if (id === activeId) {
      setActiveId(remain[0].id);
    }

    return remain;
  });
};

const [showMenu, setShowMenu] = useState(false);

const reloadProducts = () => {
  // gọi API load lại sản phẩm
  console.log("Reload products");
};

const logout = () => {
  console.log("Logout");
};
useEffect(() => {
  if (toast) {
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }
   
}, [toast]);
useEffect(() => {
  localStorage.setItem("pos_bills", JSON.stringify(bills));
}, [bills]);

useEffect(() => {
  localStorage.setItem("pos_active_bill", String(activeId));
}, [activeId]);
useEffect(() => {
  const saved = localStorage.getItem("pos_bills");
  if (saved) {
    const parsed = JSON.parse(saved);
    setBills(parsed);
    setActiveId(parsed[0]?.id);
  }
}, []);

  return (
    <div className="pos">
      {/* HEADER */}
      <div className="pos-header">
  {/* LEFT */}
  <div className="header-left">
    <input className="search" placeholder="🔍 Tìm hàng hóa" />

    <div className="bill-tabs">
      {bills.map((b) => (
        <div
          key={b.id}
          className={`bill-tab ${b.id === activeId ? "active" : ""}`}
          onClick={() => setActiveId(b.id)}
        >
          <span>{b.name}</span>
          <span
            className="close"
            onClick={(e) => {
              e.stopPropagation();
              closeBill(b.id);
            }}
          >
            ×
          </span>
        </div>
      ))}

      <button className="add-bill" onClick={addBill}>＋</button>
    </div>
  </div>

  {/* RIGHT */}
  <div className="header-right">
    <button className="icon-btn" title="Tải lại sản phẩm" onClick={reloadProducts}>
      ⟳
    </button>

    <div className="user-name">Admin</div>

    <div className="menu-wrapper">
      <button className="icon-btn" onClick={() => setShowMenu(!showMenu)}>
        ☰
      </button>

      {showMenu && (
        <div className="menu-popup">
          <div className="menu-item" onClick={() => {setShowMenu(false); navigate("/admin/products");}}>📦 Quản lý sản phẩm & tồn kho</div>
          <div className="menu-item">🧾 Quản lý đơn hàng</div>
          <div className="menu-item">👥 Quản lý khách hàng</div>
          <div className="menu-item">📊 Báo cáo & thống kê</div>

          <div className="menu-divider" />

          <div className="menu-item logout" onClick={logout}>
            🚪 Đăng xuất
          </div>
        </div>
      )}
    </div>
  </div>
</div>


      {/* BODY */}
      <div className="pos-body">
        {/* CART */}
        <div className="cart">
         <div className="bill-header">
          <div className="bill-title">
            <span className="bill-icon">🧾</span>
            <span className="bill-name">{activeBill.name}</span>
          </div>

          <span className="bill-status">Đang bán</span>
        </div>


          <div className="cart-list">
            {activeBill.cart.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">
                  <div className="paper" />
                  <div className="dots">...</div>
                </div>
                <div className="empty-text">Chưa có sản phẩm</div>
              </div>
            )}

            {activeBill.cart.map(i => (
              <div key={i.id} className="cart-item">
                <div className="info">
                  <div className="name">{i.name}</div>
                  <div className="price">{i.price.toLocaleString()} đ</div>
                </div>

                <div className="actions">
                  <button onClick={() => changeQty(i.id, -1)}>-</button>
                  <span>{i.quantity}</span>
                  <button onClick={() => changeQty(i.id, 1)}>+</button>

                  <button
                    className="remove"
                    onClick={() => removeItem(i.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Số lượng</span>
              <b>{totalQty}</b>
            </div>

            <div className="summary-total">
              <span>Tổng tiền</span>
              <strong>{totalPrice.toLocaleString()} đ</strong>
            </div>
          </div>

        </div>

        {/* PRODUCTS */}
        <div className="products">
          {mockProducts.map((p) => (
            <div
              key={p.id}
              className="product-card"
              onClick={() => addToCart(p)}
            >
              <div className="product-image">
                <img
                  src={p.image}
                  alt={p.name}
                  onError={(e) =>
                    (e.currentTarget.src = "https://via.placeholder.com/150")
                  }
                />
              </div>

              <div className="product-info">
                <div className="p-name">{p.name}</div>
                <div className="p-price">{p.price.toLocaleString()} đ</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="checkout">
        <button
          disabled={activeBill.cart.length === 0}
          onClick={handleCheckout}
        >
          THANH TOÁN
        </button>
      </div>

      {showCheckout && (
        <div className="checkout-overlay">
          <div className="checkout-modal">

            <h2>Xác nhận thanh toán</h2>

            {/* ORDER INFO */}
            <div className="checkout-info">
              <div>🧾 {activeBill.name}</div>
              <div>Số lượng: <b>{totalQty}</b></div>
              <div className="price">
                Tổng tiền: <span>{totalPrice.toLocaleString()} đ</span>
              </div>
            </div>

            {/* CUSTOMER */}
            <div className="section">
              <label>Khách hàng</label>
              <div className="customer-row">
                <select onChange={(e) => setCustomer(e.target.value)}>
                  <option value="">Khách lẻ</option>
                  <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                  <option value="Trần Thị B">Trần Thị B</option>
                </select>

                <button className="add-customer">＋ Thêm</button>
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="section">
              <label>Phương thức thanh toán</label>

              <div className="payment-methods">
                <button
                  className={paymentMethod === "cash" ? "active" : ""}
                  onClick={() => setPaymentMethod("cash")}
                >
                  💵 Tiền mặt
                </button>

                <button
                  className={paymentMethod === "bank" ? "active" : ""}
                  onClick={() => setPaymentMethod("bank")}
                >
                  🏦 Chuyển khoản
                </button>
              </div>
            </div>

            {/* QR */}
            {paymentMethod === "bank" && (
              <div className="qr-box">
                <img
                  src={`https://img.vietqr.io/image/MB-0123456789-qr_only.png?amount=${totalPrice}&addInfo=HD-${activeBill.id}&accountName=NGUYEN%20VAN%20A`}
                  alt="VietQR"
                  width={180}
                  height={180}
                />
                <div className="qr-info">
                  <div><b>Ngân hàng:</b> Vietcombank</div>
                  <div><b>STK:</b> 0123456789</div>
                  <div><b>Số tiền:</b> {totalPrice.toLocaleString()} đ</div>
                  <div><b>Nội dung:</b> {activeBill.name}</div>
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="checkout-actions">
              <button className="cancel" onClick={() => setShowCheckout(false)}>
                Hủy
              </button>
              <button className="confirm"  >
                Xác nhận thanh toán
              </button>
            </div>

          </div>
        </div>
      )}
      {toast && (
        <div className="toast">
          ⚠️ {toast}
        </div>
      )}

    </div>
    
  );
}
