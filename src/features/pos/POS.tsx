import { useEffect, useState } from "react";
import "./POS.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface Bill {
  id: number;
  name: string;
  cart: CartItem[];
}




export default function POS() {

  const navigate = useNavigate();

  const [bills, setBills] = useState<Bill[]>(() => {
  const saved = localStorage.getItem("pos_bills");
  return saved
    ? JSON.parse(saved)
    : [{ id: 1, name: "Hóa đơn 1", cart: [] }];
});
const [errorMessage, setErrorMessage] = useState<string | null>(null);

const [toast, setToast] = useState<string | null>(null);
const [showSuccess, setShowSuccess] = useState(false);

const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank">("cash");
  const [customer, setCustomer] = useState<string | null>(null);
 const activeBill = bills.find((b) => b.id === activeId);

  const [products, setProducts] = useState<Product[]>([]);
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
 const handleConfirmPayment = async () => {
  if (!activeBill) {
    setToast("❌ Không tìm thấy hóa đơn");
    return;
  }

  if (!totalPrice || totalPrice <= 0) {
    setToast("❌ Tổng tiền không hợp lệ");
    return;
  }

  try {
    const res = await axios.post("http://127.0.0.1:8001/api/bills", {
      customer_name: customer || "Khách lẻ",
      staff_name: "Admin",
      paid: totalPrice,
      items: activeBill.cart.map(i => ({
        product_id: i.id,
        product_name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    });
      const billId =
        res.data?.data?.id ||
        res.data?.id;

      if (!billId) {
        console.error("❌ Không lấy được bill_id", res.data);
        throw new Error("Không lấy được bill_id");
      }
      await axios.post("http://127.0.0.1:8002/api/payments", {
    bill_id: billId,
    amount: totalPrice,
    method: paymentMethod,
  });

  setShowCheckout(false);
  setShowSuccess(true);
setBills((prev) => {
      const remain = prev.filter((b) => b.id !== activeBill.id);

      if (remain.length > 0) {
        setActiveId(remain[0].id);
        return remain;
      }

      const newBill = {
        id: Date.now(),
        name: "Hóa đơn 1",
        cart: [],
      };
      setActiveId(newBill.id);
      return [newBill];
    });
  // Tự đóng sau 2 giây
  setTimeout(() => {
    setShowSuccess(false);
  }, 2000);
    setShowCheckout(false);
  } catch (err: any) {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 422) {
      const msg =
        err.response.data?.message ||
        "Sản phẩm trong kho không đủ";

      setErrorMessage(msg); 
      return;
    }
  }

  setToast("❌ Thanh toán thất bại");
}

};


const handleCheckout = () => {
  if (activeBill?.cart.length === 0) {
    setToast("Vui lòng thêm sản phẩm trước khi thanh toán");
    return;
  }

  setShowCheckout(true);
};
  const totalQty = activeBill?.cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = activeBill?.cart.reduce(
    (s, i) => s + i.quantity * i.price,
    0
  );

const changeQty = (id: number, delta: number) => {
  setBills(prev =>
    prev.map(b =>
      b.id !== activeBill?.id
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
      b.id !== activeBill?.id
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
useEffect(() => {

  fetchAllProducts();
}, []);

const fetchAllProducts = async () => {
  let page = 1;
  let all: Product[] = [];

  while (true) {
    const res = await axios.get("http://127.0.0.1:8000/api/products", {
      params: { page, per_page: 100 },
    });

    const data = res.data.data;

    all = all.concat(
      data.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        stock: p.stock,
        image: p.primary_image
          ? `http://127.0.0.1:8000/storage/${p.primary_image.path}`
          : "",
      }))
    );

    if (data.length < 100) break;
    page++;
  }

  setProducts(all);
};

const reloadProducts = () => {
  fetchAllProducts();
};
const filteredProducts = products.filter((p) =>
  p.name.toLowerCase().includes(search.toLowerCase())
);



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
    <input
  className="search"
  placeholder="🔍 Tìm hàng hóa"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
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
          <div className="menu-item" onClick={() => {setShowMenu(false); navigate("/admin/bill");}}>🧾 Quản lý đơn hàng</div>
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
            <span className="bill-name">{activeBill?.name}</span>
          </div>

          <span className="bill-status">Đang bán</span>
        </div>


          <div className="cart-list">
            {activeBill?.cart.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">
                  <div className="paper" />
                  <div className="dots">...</div>
                </div>
                <div className="empty-text">Chưa có sản phẩm</div>
              </div>
            )}

            {activeBill?.cart.map(i => (
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
              <strong>{totalPrice?.toLocaleString()} đ</strong>
            </div>
          </div>

        </div>

        {/* PRODUCTS */}
        <div className="products">
            {filteredProducts.map((p) => {
              const outOfStock = p.stock <= 0;
              const lowStock = p.stock > 0 && p.stock <= 5;

              return (
                <div
                  key={p.id}
                  className={`product-card ${
                    outOfStock ? "disabled" : ""
                  }`}
                  onClick={() => {
                    if (!outOfStock) addToCart(p);
                  }}
                >
                  <div className="product-image">
                    <img
                      src={p.image}
                      alt={p.name}
                      onError={(e) =>
                        (e.currentTarget.src = "https://placehold.co/150x150")
                      }
                    />

                    {/* 🔥 BADGE TỒN KHO */}
                    <span
                      className={`stock-badge ${
                        outOfStock
                          ? "out"
                          : lowStock
                          ? "low"
                          : "ok"
                      }`}
                    >
                      {outOfStock
                        ? "Hết hàng"
                        : `Còn ${p.stock}`}
                    </span>
                  </div>

                  <div className="product-info">
                    <div className="p-name">{p.name}</div>
                    <div className="p-price">
                      {p.price.toLocaleString()} đ
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

      </div>

      {/* FOOTER */}
      <div className="checkout">
        <button
           disabled={!activeBill || activeBill.cart.length === 0}
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
              <div>🧾 {activeBill?.name}</div>
              <div>Số lượng: <b>{totalQty}</b></div>
              <div className="price">
                Tổng tiền: <span>{totalPrice?.toLocaleString()} đ</span>
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
                  src={`https://img.vietqr.io/image/MB-0123456789-qr_only.png?amount=${totalPrice}&addInfo=HD-${activeBill?.id}&accountName=NGUYEN%20VAN%20A`}
                  alt="VietQR"
                  width={180}
                  height={180}
                />
                <div className="qr-info">
                  <div><b>Ngân hàng:</b> Vietcombank</div>
                  <div><b>STK:</b> 0123456789</div>
                  <div><b>Số tiền:</b> {totalPrice?.toLocaleString()} đ</div>
                  <div><b>Nội dung:</b> {activeBill?.name}</div>
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="checkout-actions">
              <button className="cancel" onClick={() => setShowCheckout(false)}>
                Hủy
              </button>
              <button
                  className="confirm"
                  onClick={handleConfirmPayment}
                >
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
{/* ✅ THÔNG BÁO THÀNH CÔNG */}
    {showSuccess && (
      <div className="success-overlay">
        <div className="success-box">
          <div className="success-icon">✅</div>
          <h2>Thanh toán thành công</h2>
          <p>Cảm ơn quý khách!</p>
        </div>
      </div>
    )}

    {/* ❌ LỖI HẾT HÀNG / NGHIỆP VỤ */}
    {errorMessage && (
      <div className="error-overlay">
        <div className="error-box">
          <div className="error-icon">⚠️</div>
          <h2>Không thể thanh toán</h2>
          <p>{errorMessage}</p>

          <button
            className="error-btn"
            onClick={() => setErrorMessage(null)}
          >
            Đã hiểu
          </button>
        </div>
      </div>
    )}

    {/* TOAST */}
    {toast && (
      <div className="toast">
        ⚠️ {toast}
      </div>
    )}

    </div>
    
  );
  
}
