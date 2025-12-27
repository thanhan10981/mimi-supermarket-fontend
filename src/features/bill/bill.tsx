import {
  Card,
  Input,
  Radio,
  InputNumber,
  DatePicker,
  Button,
  Space,
  Table,
  Tag,
  Modal,
  Form,
  message,
} from "antd";
import "./bill.css";
import {
  DownloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useEffect, useState, type JSX, type Key } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import * as XLSX from "xlsx";

const { RangePicker } = DatePicker;

/* ================= TYPES ================= */
type BillStatus = "PAID" | "UNPAID" | "PARTIAL";
type BillItem = {
  id: number;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

type BillRow = {
  id: number;
  code: string;
  customer: string;
  phone: string;
  staff: string;
  total: number;
  paid: number;
  created_at: string;
  status: BillStatus;
};

type ApiResponse = {
  data: BillRow[];
  meta: {
    total: number;
  };
};
type Payment = {
  id: number;
  method: string;
  amount: number;
  status: string;
};


/* ================= CONFIG ================= */
const API_URL = "http://127.0.0.1:8001/api/bills";

const statusTag: Record<BillStatus, JSX.Element> = {
  PAID: <Tag color="green">Đã thanh toán</Tag>,
  UNPAID: <Tag color="red">Chưa thanh toán</Tag>,
  PARTIAL: <Tag color="orange">Thanh toán một phần</Tag>,
};

const formatVND = (n: number) => `${n.toLocaleString()}đ`;

/* ================= COMPONENT ================= */
export default function Bill() {
  const [data, setData] = useState<BillRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
const [openItems, setOpenItems] = useState(false);
const [billItems, setBillItems] = useState<BillItem[]>([]);
const [loadingItems, setLoadingItems] = useState(false);
const [paymentMap, setPaymentMap] = useState<Record<number, Payment | null>>(
  {}
);
const paymentLabel: Record<string, string> = {
  cash: "Tiền mặt",
  bank: "Chuyển khoản",
  momo: "MoMo",
  vnpay: "VNPay",
};

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  /* ===== UPDATE MODAL ===== */
  const [openEdit, setOpenEdit] = useState(false);
  const [editingBill, setEditingBill] = useState<BillRow | null>(null);
  const [form] = Form.useForm();

  /* ================= LOAD DATA ================= */
  async function loadBills(params?: any) {
    setLoading(true);
    try {
      const res = await axios.get<ApiResponse>(API_URL, {
        params: { page, ...params },
      });
      setData(res.data.data);
      setTotal(res.data.meta.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }
  async function loadPaymentMethod(billId: number) {
  // đã load rồi thì thôi
  if (paymentMap[billId] !== undefined) return;

  try {
    const res = await axios.get(
      `http://127.0.0.1:8002/api/payments/by-bill/${billId}`
    );

    const payment = res.data?.[0] ?? null;

    setPaymentMap((prev) => ({
      ...prev,
      [billId]: payment,
    }));
  } catch (e) {
    console.error("Không tải được payment", e);
    setPaymentMap((prev) => ({
      ...prev,
      [billId]: null,
    }));
  }
}

  async function openItemsModal(billId: number) {
  setLoadingItems(true);
  setOpenItems(true);

  try {
    const res = await axios.get(`${API_URL}/${billId}`);
    setBillItems(res.data.data.items);
  } catch (e) {
    message.error("Không tải được danh sách sản phẩm");
  } finally {
    setLoadingItems(false);
  }
}

function exportExcelFromApiData() {
  if (!data.length) {
    message.warning("Không có dữ liệu để xuất");
    return;
  }

  // 1️⃣ Map dữ liệu theo cột Excel
  const excelData = data.map((b, index) => ({
    "STT": index + 1,
    "Mã HĐ": b.code,
    "Khách hàng": b.customer,
    "SĐT": b.phone,
    "Nhân viên": b.staff,
    "Tổng tiền": b.total,
    "Đã thanh toán": b.paid,
    "Còn lại": Math.max(b.total - b.paid, 0),
    "Trạng thái": b.status,
    "Ngày tạo": b.created_at,
  }));

  // 2️⃣ Tạo worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // 3️⃣ Tạo workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "HoaDonDichVu");

  // 4️⃣ Xuất file
  XLSX.writeFile(workbook, "hoa-don-dich-vu.xlsx");
}

  useEffect(() => {
    loadBills();
  }, [page]);

  /* ================= DELETE ================= */
  function handleDelete(ids: number[]) {
    if (!ids.length) return;

    Modal.confirm({
      title: `Xóa ${ids.length} hóa đơn?`,
      content: "Hành động này không thể hoàn tác",
      okType: "danger",
      onOk: async () => {
        await Promise.all(
          ids.map((id) => axios.delete(`${API_URL}/${id}`))
        );
        message.success("Đã xóa hóa đơn");
        setSelectedRowKeys([]);
        loadBills();
      },
    });
  }

  /* ================= UPDATE ================= */
function openEditModal(bill: BillRow) {
  setEditingBill(bill);

  form.setFieldsValue({
    customer: bill.customer,
    phone: bill.phone,
    staff: bill.staff,
    total: bill.total,
    paid: bill.paid,
  });

  setOpenEdit(true);
}


  async function submitUpdate() {
  const v = await form.validateFields();

  const payload = {
    customer_name: v.customer,
    customer_phone: v.phone,
    service_name: v.service,
    staff_name: v.staff,
    total: v.total,
    paid: v.paid,
  };

  await axios.put(`${API_URL}/${editingBill!.id}`, payload);
  message.success("Cập nhật thành công");
  setOpenEdit(false);
  loadBills();
}


  /* ================= RENDER ================= */
  return (
    <div className="bill-page">
      {/* ===== FILTER ===== */}
      <div className="bill-filter">
        <Card>
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Tìm theo mã HĐ, khách hàng, SĐT..."
              onChange={(e) =>
                loadBills({ search: e.target.value, page: 1 })
              }
            />

            <Radio.Group
              defaultValue="ALL"
              onChange={(e) =>
                loadBills({
                  status:
                    e.target.value === "ALL" ? undefined : e.target.value,
                  page: 1,
                })
              }
            >
              <Space direction="vertical">
                <Radio value="ALL">Tất cả</Radio>
                <Radio value="PAID">Đã thanh toán</Radio>
                <Radio value="PARTIAL">Thanh toán một phần</Radio>
                <Radio value="UNPAID">Chưa thanh toán</Radio>
              </Space>
            </Radio.Group>

            <RangePicker
              onChange={(dates) => {
                if (!dates || !dates[0] || !dates[1]) {
                  loadBills({ page: 1 });
                  return;
                }
                loadBills({
                  date_from: dates[0].format("YYYY-MM-DD"),
                  date_to: dates[1].format("YYYY-MM-DD"),
                  page: 1,
                });
              }}
            />
          </Space>
        </Card>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="bill-content">
        <div className="bill-header">
          <h2>Hóa đơn dịch vụ</h2>

          <div className="bill-header-actions">
            {selectedRowKeys.length > 0 && (
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() =>
                  handleDelete(selectedRowKeys as number[])
                }
              >
                Xóa ({selectedRowKeys.length})
              </Button>
            )}
           <Button
              icon={<DownloadOutlined />}
              onClick={exportExcelFromApiData}
            >
              Export
            </Button>

          </div>
        </div>

        <Table<BillRow>
          loading={loading}
          dataSource={data}
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          pagination={{
            current: page,
            pageSize: 20,
            total,
            onChange: setPage,
          }}
          expandable={{
            expandRowByClick: true,
            onExpand: (expanded, record) => {
              if (expanded) {
                loadPaymentMethod(record.id);
              }
            },
            expandedRowRender: (r) => (
              <div className="bill-detail">
                <div className="bill-detail-header">
                  <span>
                    {r.code} • {r.customer} • {r.phone}
                  </span>
                  <div>
                    <Button style={{ marginRight: 8 }}
                        type="primary"
                        onClick={() => openItemsModal(r.id)}
                      >
                        Xem chi tiết danh sách sản phẩm
                      </Button>

                    <Button
                      type="primary"
                      onClick={() => openEditModal(r)}
                    >
                      Cập nhật
                    </Button>

                    <Button
                      danger
                      style={{ marginLeft: 8 }}
                      onClick={() => handleDelete([r.id])}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>

                <div className="bill-detail-body">
                  <div className="bill-detail-col">
                    <p><b>Nhân viên:</b> {r.staff}</p>
                    <p><b>Ngày tạo:</b> {r.created_at}</p>
                    <p>
                      <b>PPTT:</b>{" "}
                      {paymentMap[r.id] === undefined && "Đang tải..."}
                      {paymentMap[r.id] === null && "Chưa thanh toán"}
                      {paymentMap[r.id] && (
                        <Tag color="blue">
                            {paymentLabel[paymentMap[r.id]!.method] ??
                              paymentMap[r.id]!.method}
                          </Tag>

                      )}
                    </p>

                  </div>

                  <div className="bill-detail-col">
                    <p><b>Tổng tiền:</b> {formatVND(r.total)}</p>
                    <p><b>Đã thanh toán:</b> {formatVND(r.paid)}</p>
                    <p><b>Còn lại:</b> {formatVND(Math.max(r.total - r.paid, 0))}</p>
                  </div>

                  <div className="bill-detail-col">
                    <p><b>Trạng thái:</b> {statusTag[r.status]}</p>
                  </div>
                </div>

                <div className="bill-detail-footer">
                  <span>✔ Tổng {formatVND(r.total)}</span>
                  <span>Đã thu {formatVND(r.paid)}</span>
                  <span>Còn lại {formatVND(Math.max(r.total - r.paid, 0))}</span>
                </div>
              </div>
            )
            ,
          }}
          columns={[
            { title: "Mã HĐ", dataIndex: "code" },
            {
              title: "Khách hàng",
              render: (_, r) => (
                <>
                  <b>{r.customer}</b>
                  <div>{r.phone}</div>
                </>
              ),
            },

            { title: "Nhân viên", dataIndex: "staff" },
            {
              title: "Tổng tiền",
              render: (_, r) => formatVND(r.total),
            },
            {
              title: "Trạng thái",
              dataIndex: "status",
              render: (v: BillStatus) => statusTag[v],
            },
            { title: "Ngày tạo", dataIndex: "created_at" },
          ]}
        />
      </div>
        <Modal
          open={openItems}
          title="Danh sách sản phẩm trong hóa đơn"
          footer={null}
          onCancel={() => setOpenItems(false)}
          width={700}
        >
          <Table<BillItem>
            loading={loadingItems}
            dataSource={billItems}
            rowKey="id"
            pagination={false}
            columns={[
              {
                title: "Sản phẩm",
                dataIndex: "product_name",
              },
              {
                title: "Đơn giá",
                render: (_, r) => formatVND(r.price),
              },
              {
                title: "Số lượng",
                dataIndex: "quantity",
              },
              {
                title: "Thành tiền",
                render: (_, r) => formatVND(r.subtotal),
              },
            ]}
          />
        </Modal>

      {/* ===== UPDATE MODAL ===== */}
      <Modal
        open={openEdit}
        title="Cập nhật hóa đơn"
        onCancel={() => setOpenEdit(false)}
        onOk={submitUpdate}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="customer" label="Khách hàng" required>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="SĐT">
            <Input />
          </Form.Item>
          <Form.Item name="staff" label="Nhân viên">
            <Input />
          </Form.Item>
          <Form.Item name="total" label="Tổng tiền">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="paid" label="Đã thanh toán">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
