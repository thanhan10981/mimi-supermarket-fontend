import {
  Card,
  Input,
  Select,
  Radio,
  InputNumber,
  DatePicker,
  Button,
  Space,
  Table,
  Image,
  Modal,
  Form,
  Upload,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import "./product.css";
import { UploadOutlined, DownloadOutlined, SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState, type Key } from "react";
import dayjs from "dayjs";

import { fetchProducts, createProduct, updateProduct, deleteProduct, uploadProductImage, fetchNextProductCode } from "../../api/product.api";
import type { ProductRow } from "../../api/product.api";

import { fetchCategories } from "../../api/category.api";
import type { Category } from "../../api/category.api";

import { fetchSuppliers } from "../../api/supplier.api";
import type { Supplier } from "../../api/supplier.api";

import { fetchInventoryLogs } from "../../api/inventory.api";
import type { InventoryLogRow, InventoryLogType } from "../../api/inventory.api";

import type { UploadFile } from "antd/es/upload/interface";
import { exportProductsToExcel } from "../../utils/productExcel";
import { parseProductsExcel } from "../../utils/productExcel";
import axiosClient from "../../api/axiosClient";
import { AutoComplete } from "antd";



const { RangePicker } = DatePicker;

type CreateProductForm = {
  code: string;
  name: string;
  category_id?: number;
  supplier_id?: number;
  price: number;
  cost_price: number;
  stock?: number;
  expired_at?: dayjs.Dayjs;
};

export default function Product() {
  // selection
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: Key[]) => setSelectedRowKeys(keys),
  };

  // data
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);

  // paginate
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // BE paginate(10)
  const [total, setTotal] = useState(0);

  // filter states
  const [keyword, setKeyword] = useState<string>("");
  const [status, setStatus] = useState<"ALL" | "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK">("ALL");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [supplierId, setSupplierId] = useState<number | undefined>(undefined);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [createdRange, setCreatedRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  // dropdown data
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // modal add
  const [openForm, setOpenForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  
  async function openCreateModal() {
    setOpenForm(true);
    setEditId(null); 
    form.resetFields();
    setUploadFile(null);
    setFileList([]);

    try {
      const code = await fetchNextProductCode();
      form.setFieldsValue({ code });
    } catch {
      message.error("Không lấy được mã hàng (next-code). Kiểm tra API.");
    }
  }

  //modal update
  const [editId, setEditId] = useState<number | null>(null);

  function openEditModal(r: ProductRow) {
  setEditId(r.id);
  setOpenForm(true);

  form.setFieldsValue({
    code: r.code,
    name: r.name,
    category_id: r.category_id ?? undefined,
    supplier_id: r.supplier_id ?? undefined,
    price: r.price,
    cost_price: r.cost_price,
    stock: r.stock,
    expired_at: r.expired_at ? dayjs(r.expired_at) : null,
  });

  setUploadFile(null); // muốn đổi ảnh thì chọn lại
  if (r.primary_image?.path) {
    setFileList([
      {
        uid: String(r.primary_image.id),
        name: r.primary_image.path.split("/").pop() || "image",
        status: "done",
        url: imgUrl(r.primary_image.path),
      },
    ]);
  } else {
    setFileList([]);
  }
}

// xóa
function handleDelete(id: number) {
  Modal.confirm({
    title: "Xóa sản phẩm?",
    content: "Xóa rồi không khôi phục được.",
    okText: "Xóa",
    okButtonProps: { danger: true },
    cancelText: "Hủy",
    async onOk() {
      try {
        await deleteProduct(id);
        message.success("Đã xóa");

        const res = await fetchProducts(queryParams);
        setProducts(res.data);
        setTotal(res.total);
        setPageSize(res.per_page);
      } catch (e: unknown) {
        const err = e as { response?: { data?: { message?: string } } };
        message.error(err.response?.data?.message || "Xóa thất bại");
      }
    },
  });
}
//Trạng thái
const [fileList, setFileList] = useState<UploadFile[]>([]);

  // build query for BE (match ProductController@index)
  const queryParams = useMemo(() => {
    const [from, to] = createdRange;

    return {
      page,
      keyword: keyword || undefined,
      status: status === "ALL" ? undefined : status,
      category_id: categoryId,
      supplier_id: supplierId,
      min_price: minPrice ?? undefined,
      max_price: maxPrice ?? undefined,
      created_from: from ? from.format("YYYY-MM-DD") : undefined,
      created_to: to ? to.format("YYYY-MM-DD") : undefined,
    };
  }, [page, keyword, status, categoryId, supplierId, minPrice, maxPrice, createdRange]);

  //excel
  async function handleExportAll() {
  try {
    // lấy số lượng đủ lớn để gom hết
    const res = await fetchProducts({ ...queryParams, page: 1, per_page: 999999 });

    exportProductsToExcel(res.data);
    message.success(`Đã export ${res.data.length} sản phẩm`);
  } catch {
    message.error("Export thất bại");
  }
}

  // load categories/suppliers once
  useEffect(() => {
    (async () => {
      try {
        const c = await fetchCategories({ page: 1 });
        setCategories(c.data ?? []);
      } catch {
        // ignore
      }
      try {
        const s = await fetchSuppliers({ page: 1 });
        setSuppliers(s.data ?? []);
      } catch {
        // ignore
      }
    })();
  }, []);

  // lịch sử
  const [openLogModal, setOpenLogModal] = useState(false);
  const [logLoading, setLogLoading] = useState(false);
  const [logs, setLogs] = useState<InventoryLogRow[]>([]);
  const [logPage, setLogPage] = useState(1);
  const [logTotal, setLogTotal] = useState(0);

  const [logProductId, setLogProductId] = useState<number | undefined>(undefined);
  const [logType, setLogType] = useState<InventoryLogType | undefined>(undefined);

  async function loadLogs(p = 1, type = logType, productId = logProductId) {
    setLogLoading(true);
    try {
      const res = await fetchInventoryLogs({
       page: p,
        type,
        product_id: productId,
      });
      setLogs(res.data);
      setLogTotal(res.total);
      setLogPage(res.current_page);
    } finally {
      setLogLoading(false);
    }
  }
  //mở log
  async function openLogs() {
    setOpenLogModal(true);
    setLogPage(1);
    await loadLogs(1);
  }
// thêm nhà cung cấp & nhóm hàng
const [openCategoryModal, setOpenCategoryModal] = useState(false);
const [categoryForm] = Form.useForm();
const [openSupplierModal, setOpenSupplierModal] = useState(false);
const [supplierForm] = Form.useForm();
const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);



  // load products (with filters + pagination)
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetchProducts(queryParams);
        setProducts(res.data);
        setTotal(res.total);
        setPageSize(res.per_page);
      } finally {
        setLoading(false);
      }
    })();
  }, [queryParams]);

  // load logs
  useEffect(() => {
  if (!openLogModal) return;
  loadLogs(1);
  }, [logType, logProductId]);

  // helper: image url (Laravel public storage)
  const imgUrl = (path?: string) =>
    path ? `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/storage/${path}` : "";

  // columns (IMPORTANT: use price/cost_price and primary_image)
  const columns = useMemo<ColumnsType<ProductRow>>(
    () => [
      { title: "Mã hàng", dataIndex: "code", width: 120 },
      {
        title: "Tên hàng",
        dataIndex: "name",
        width: 280,
        render: (_: unknown, r: ProductRow) => (
          <div className="product-name">
            <Image
              width={36}
              src={r.primary_image?.path ? imgUrl(r.primary_image.path) : undefined}
              fallback="/assets/no-image.png"
            />
            {r.name}
          </div>
        ),
      },
      {
        title: "Giá bán",
        dataIndex: "price",
        render: (v: number) => `${Number(v).toLocaleString()}đ`,
      },
      {
        title: "Giá vốn",
        dataIndex: "cost_price",
        render: (v: number) => `${Number(v).toLocaleString()}đ`,
      },
      { title: "Tồn kho", dataIndex: "stock" },
      {
        title: "Nhà cung cấp",
        render: (_: unknown, r: ProductRow) => r.supplier?.name ?? "-",
      },
      {
        title: "Thời gian tạo",
        dataIndex: "created_at",
        render: (v: string) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "-"),
      },
      {
        title: "Dự kiến hết",
        dataIndex: "expired_at",
        render: (v: string | null | undefined) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categories, suppliers]
  );

  // apply filter change => reset to page 1
  const resetToFirstPage = () => setPage(1);

  async function handleSubmit(values: CreateProductForm) {
    setCreating(true);
    try {
      const payload = {
        code: values.code, // create thì có sẵn, edit thì giữ nguyên (readonly)
        name: values.name,
        category_id: values.category_id ?? null,
        supplier_id: values.supplier_id ?? null,
        price: Number(values.price),
        cost_price: Number(values.cost_price),
        stock: Number(values.stock ?? 0),
        expired_at: values.expired_at ? dayjs(values.expired_at).format("YYYY-MM-DD") : null,
      };

      // ✅ UPDATE
      if (editId) {
        await updateProduct(editId, payload);

        // nếu user chọn ảnh mới -> upload & set primary
        if (uploadFile) {
          await uploadProductImage(editId, uploadFile, true);
        }

        message.success("Cập nhật thành công");
      }
      // ✅ CREATE
      else {
        const created = await createProduct(payload);

        if (uploadFile) {
          await uploadProductImage(created.id, uploadFile, true);
        }

        message.success("Thêm mới thành công");
      }

      setOpenForm(false);
      setEditId(null);
      setUploadFile(null);
      form.resetFields();

      // reload list
      const res = await fetchProducts(queryParams);
      setProducts(res.data);
      setTotal(res.total);
      setPageSize(res.per_page ?? 10);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || "Thao tác thất bại");
    } finally {
      setCreating(false);
    }
  }


  return (
    <div className="product-page">
      {/* ===== SIDEBAR ===== */}
      <div className="product-filter">
        <Card>
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <div className="product-search-box">
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="Tìm theo mã, tên hàng..."
                className="product-search-input"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  resetToFirstPage();
                }}
              />
            </div>

            <div className="product-filter-label">Trạng thái hàng</div>
            <Radio.Group
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                resetToFirstPage();
              }}
            >
              <Space direction="vertical">
                <Radio value="ALL">Tất cả</Radio>
                <Radio value="IN_STOCK">Còn hàng</Radio>
                <Radio value="OUT_OF_STOCK">Hết hàng</Radio>
                <Radio value="LOW_STOCK">Sắp hết</Radio>
              </Space>
            </Radio.Group>

            <div className="product-filter-label with-action">
              <span>Nhóm hàng (Category)</span>
              <button
                className="icon-add-btn"
                onClick={() => setOpenCategoryModal(true)}
                title="Thêm nhóm hàng"
              >
                +
              </button>
            </div>

            <Select
              style={{ width: "100%" }}
              placeholder="Chọn nhóm hàng"
              allowClear
              value={categoryId}
              onChange={(v) => {
                setCategoryId(v);
                resetToFirstPage();
              }}
              options={categories.map((c) => ({ value: c.id, label: `${c.code} - ${c.name}` }))}
            />

            <div className="product-filter-label with-action">
              <span>Nhà cung cấp</span>
              <button
                className="icon-add-btn"
                onClick={() => setOpenSupplierModal(true)}
                title="Thêm nhà cung cấp"
              >
                +
              </button>
            </div>

            <Select
              style={{ width: "100%" }}
              placeholder="Chọn nhà cung cấp"
              allowClear
              value={supplierId}
              onChange={(v) => {
                setSupplierId(v);
                resetToFirstPage();
              }}
              options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
            />

            <div>
              <div className="product-filter-label">Giá bán</div>
              <Space>
                <InputNumber
                  placeholder="Từ"
                  style={{ width: "100%" }}
                  value={minPrice ?? undefined}
                  onChange={(v) => {
                    setMinPrice(typeof v === "number" ? v : null);
                    resetToFirstPage();
                  }}
                />
                <InputNumber
                  placeholder="Đến"
                  style={{ width: "100%" }}
                  value={maxPrice ?? undefined}
                  onChange={(v) => {
                    setMaxPrice(typeof v === "number" ? v : null);
                    resetToFirstPage();
                  }}
                />
              </Space>
            </div>

            <div>
              <div className="product-filter-label">Ngày tạo</div>
              <RangePicker
                style={{ width: "100%" }}
                value={createdRange}
                onChange={(vals) => {
                  setCreatedRange(vals ?? [null, null]);
                  resetToFirstPage();
                }}
              />
            </div>

            <Button
              onClick={() => {
                setKeyword("");
                setStatus("ALL");
                setCategoryId(undefined);
                setSupplierId(undefined);
                setMinPrice(null);
                setMaxPrice(null);
                setCreatedRange([null, null]);
                setPage(1);
              }}
            >
              Reset lọc
            </Button>
          </Space>
        </Card>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="product-content">
        <div className="product-header">
          <h2>Hàng hóa</h2>

          <div className="product-header-actions">
            {selectedRowKeys.length > 1 && (
              <Button danger icon={<DeleteOutlined />} className="product-delete-btn">
                Xóa ({selectedRowKeys.length})
              </Button>
            )}

            <Button
              type="primary"
              icon={<span style={{ fontSize: 16 }}>＋</span>}
              onClick={openCreateModal}
            >
              Thêm mới
            </Button>

            <input
              type="file"
              accept=".xlsx,.xls"
              hidden
              id="import-products"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                try {
                  const items = await parseProductsExcel(file);

                  for (const p of items) {
                    await createProduct(p); // code rỗng => BE tự generate
                  }

                  message.success("Import thành công");

                  const res = await fetchProducts(queryParams);
                  setProducts(res.data);
                  setTotal(res.total);
                  setPageSize(res.per_page);
                } catch {
                  message.error("File Excel không đúng format");
                } finally {
                  e.target.value = "";
                }
              }}
            />

            <Button
              icon={<UploadOutlined />}
              onClick={() => (document.getElementById("import-products") as HTMLInputElement | null)?.click()}
            >
              Import
            </Button>

            <Button icon={<DownloadOutlined />} onClick={handleExportAll}>Export</Button>

            <Button onClick={openLogs}>Xem log</Button>
          </div>
        </div>

        <Table
          rowSelection={rowSelection}
          scroll={{ y: 600 }}
          className="product-table"
          dataSource={products}
          rowKey="id"
          loading={loading}
          columns={columns}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
          expandable={{
            expandRowByClick: true,
            expandedRowRender: (r: ProductRow) => (
              <div className="product-detail">
                <div className="product-detail-header">
                  <span>{r.name}</span>
                  <div>
                    <Button type="primary" onClick={() => openEditModal(r)}>Cập nhật</Button>
                    <Button danger style={{ marginLeft: 8 }} onClick={() => handleDelete(r.id)}>
                      Xóa
                    </Button>
                  </div>
                </div>

                <div className="product-detail-body">
                  <Image
                    width={160}
                    src={r.primary_image?.path ? imgUrl(r.primary_image.path) : undefined}
                    fallback="/assets/no-image.png"
                  />

                  <div className="product-detail-info">
                    <p>
                      <b>Mã hàng:</b> {r.code}
                    </p>
                    <p>
                      <b>Loại hàng:</b> {r.category?.type ?? "-"}
                    </p>
                    <p>
                      <b>Nhà cung cấp:</b> {r.supplier?.name ?? "-"}
                    </p>
                  </div>

                  <div className="product-detail-info">
                    <p>
                      <b>Giá bán:</b> {Number(r.price).toLocaleString()}đ
                    </p>
                    <p>
                      <b>Giá vốn:</b> {Number(r.cost_price).toLocaleString()}đ
                    </p>
                    <p>
                      <b>Tồn kho:</b> {r.stock}
                    </p>
                  </div>
                </div>

                <div className="product-detail-footer">
                  <p>
                    <b>Thời gian tạo:</b> {dayjs(r.created_at).format("DD/MM/YYYY HH:mm")}
                  </p>
                  <p>
                    <b>Dự kiến hết:</b> {r.expired_at ? dayjs(r.expired_at).format("DD/MM/YYYY") : "-"}
                  </p>
                </div>
              </div>
            ),
          }}
        />

        {/* ===== MODAL ADD ===== */}
        <Modal
          open={openForm}
          title="Thêm mới hàng hóa"
          onCancel={() => {
            setOpenForm(false);
            setUploadFile(null);
            form.resetFields();
          }}
          footer={null}
          className="add-product-modal"
        >
          <div className="add-product-body">
            {/* LEFT – UPLOAD */}
            <div className="add-product-upload">
              <div className="upload-box">
                <UploadOutlined className="upload-icon" />
                <div className="upload-text">Tải ảnh sản phẩm</div>
                <div className="upload-sub">
                  Dung lượng tối đa 2MB
                  <br />
                  Định dạng: JPG, PNG
                </div>

                <Upload
                  accept="image/*"
                  listType="picture-card"
                  maxCount={1}
                  fileList={fileList}
                  onChange={({ fileList: fl }) => {
                    setFileList(fl);
                    const f = fl[0]?.originFileObj;
                    setUploadFile(f instanceof File ? f : null);
                  }}
                  beforeUpload={() => false}
                >
                  {fileList.length >= 1 ? null : (
                    <Button type="primary" className="upload-btn">
                      Chọn ảnh
                    </Button>
                  )}
                </Upload>
              </div>
            </div>

            {/* RIGHT – FORM */}
            <div className="add-product-form">
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="Mã hàng" name="code">
                  <Input readOnly />
                </Form.Item>

                <Form.Item label="Tên hàng" name="name" rules={[{ required: true, message: "Nhập tên hàng" }]}>
                  <Input placeholder="Nhập tên hàng" />
                </Form.Item>

                <Form.Item label="category_id" name="category_id">
                  <Select
                    allowClear
                    placeholder="Chọn nhóm hàng"
                    options={categories.map((c) => ({ value: c.id, label: `${c.code} - ${c.name}` }))}
                  />
                </Form.Item>

                <Form.Item label="Nhà cung cấp" name="supplier_id" >
                  <Select
                    allowClear
                    placeholder="Chọn nhà cung cấp"
                    options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
                  />
                </Form.Item>

                <div className="price-row">
                  <Form.Item label="Giá vốn" name="cost_price" rules={[{ required: true, message: "Nhập giá vốn" }]}>
                    <InputNumber style={{ width: "100%" }} addonAfter="đ" min={0} />
                  </Form.Item>

                  <Form.Item label="Giá bán" name="price" rules={[{ required: true, message: "Nhập giá bán" }]}>
                    <InputNumber style={{ width: "100%" }} addonAfter="đ" min={0} />
                  </Form.Item>
                </div>

                <Form.Item label="Tồn kho ban đầu" name="stock" initialValue={0}>
                  <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>

                <Form.Item label="Dự kiến hết hạn" name="expired_at">
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <div className="add-product-footer">
                  <Button
                    onClick={() => {
                      setOpenForm(false);
                      setUploadFile(null);
                      form.resetFields();
                    }}
                  >
                    Hủy bỏ
                  </Button>
                  <Button type="primary" htmlType="submit" loading={creating}>
                    {editId ? "Cập nhật" : "Thêm mới"}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Modal>
        {/* ===== MODAL LOG ===== */}
        <Modal
          open={openLogModal}
          title="Lịch sử tác động tồn kho"
          onCancel={() => setOpenLogModal(false)}
          footer={null}
          width={900}
        >
          <Space style={{ marginBottom: 12 }} wrap>
            <Select
              allowClear
              placeholder="Lọc theo sản phẩm"
              style={{ width: 320 }}
              value={logProductId}
              onChange={(v) => {
                setLogProductId(v);
                setLogPage(1);
                // gọi lại logs ngay
                setTimeout(() => loadLogs(1), 0);
              }}
              options={products.map((p) => ({
                value: p.id,
                label: `${p.code} - ${p.name}`,
              }))}
            />

            <Select
              allowClear
              placeholder="Loại log"
              style={{ width: 160 }}
              value={logType}
              onChange={(v) => {
                setLogType(v);
                setLogPage(1);
                loadLogs(1, v);
                setTimeout(() => loadLogs(1), 0);
              }}
              options={[
                { value: "import", label: "Nhập" },
                { value: "export", label: "Xuất" },
                { value: "adjust", label: "Điều chỉnh" },
              ]}
            />

            <Button
              onClick={() => {
                setLogProductId(undefined);
                setLogType(undefined);
                setLogPage(1);
                setTimeout(() => loadLogs(1), 0);
              }}
            >
              Reset lọc
            </Button>
          </Space>

          <Table<InventoryLogRow>
            rowKey="id"
            loading={logLoading}
            dataSource={logs}
            pagination={{
              current: logPage,
              total: logTotal,
              pageSize: 20, // vì BE paginate(20)
              onChange: (p) => loadLogs(p),
            }}
            columns={[
              {
                title: "Thời gian",
                dataIndex: "created_at",
                render: (v: string) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "-"),
                width: 170,
              },
              {
                title: "Sản phẩm",
                render: (_, r) =>
                  r.product ? `${r.product.code} - ${r.product.name}` : `#${r.product_id}`,
                width: 260,
              },
              {
                title: "Loại",
                dataIndex: "type",
                render: (v: InventoryLogType) =>
                  v === "import" ? "Nhập" : v === "export" ? "Xuất" : "Điều chỉnh",
                width: 120,
              },
              {
                title: "Số lượng",
                dataIndex: "quantity",
                width: 120,
              },
              {
                title: "Ghi chú",
                dataIndex: "note",
                render: (v: string | null | undefined) => v || "-",
              },
            ]}
          />
        </Modal>

        {/* ===== MODAL ADD Category ===== */}
        <Modal
          open={openCategoryModal}
          title="Nhóm hàng"
          onCancel={() => {
            setOpenCategoryModal(false);
            categoryForm.resetFields();
          }}
          onOk={async () => {
  const values = await categoryForm.validateFields();

  if (selectedCategory) {
    // UPDATE
    await axiosClient.put(
      `/api/categories/${selectedCategory.id}`,
      values
    );
    message.success("Đã cập nhật nhóm hàng");
  } else {
    // CREATE
    await axiosClient.post("/api/categories", values);
    message.success("Đã thêm nhóm hàng");
  }

  const res = await fetchCategories({ page: 1 });
  setCategories(res.data ?? []);

  setOpenCategoryModal(false);
  setSelectedCategory(null);
  categoryForm.resetFields();
}}

        >
          <Form form={categoryForm} layout="vertical">
            <Form.Item
  label="Mã nhóm"
  name="code"
  rules={[{ required: true, message: "Nhập mã nhóm" }]}
>
  <AutoComplete
    placeholder="Nhập hoặc chọn mã nhóm"
    options={categories.map(c => ({
      value: c.code,
      label: `${c.code} - ${c.name}`,
    }))}
    onSelect={(value) => {
      const found = categories.find(c => c.code === value);
      if (found) {
        setSelectedCategory(found);
        categoryForm.setFieldsValue({
          name: found.name,
          type: found.type,
        });
      }
    }}
    onChange={(value) => {
      const found = categories.find(c => c.code === value);
      if (!found) {
        setSelectedCategory(null);
        categoryForm.setFieldsValue({
          name: "",
          type: undefined,
        });
      }
    }}
    filterOption={(inputValue, option) =>
      option!.value.toLowerCase().includes(inputValue.toLowerCase())
    }
  />
</Form.Item>



            <Form.Item
              label="Tên nhóm"
              name="name"
              rules={[{ required: true, message: "Nhập tên nhóm" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Loại"
              name="type"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: "thuong", label: "Thường" },
                  { value: "combo", label: "Combo" },
                  { value: "imei", label: "IMEI" },
                  { value: "dich_vu", label: "Dịch vụ" },
                ]}
              />
            </Form.Item>
          </Form>
        </Modal>
        {/* ===== MODAL ADD supplier ===== */}
        <Modal
        open={openSupplierModal}
        title="Nhà cung cấp"
        onCancel={() => {
          setOpenSupplierModal(false);
          setSelectedSupplier(null);
          supplierForm.resetFields();
        }}
        onOk={async () => {
          const values = await supplierForm.validateFields();

          if (selectedSupplier) {
            // UPDATE
            await axiosClient.put(
              `/api/suppliers/${selectedSupplier.id}`,
              values
            );
            message.success("Đã cập nhật nhà cung cấp");
          } else {
            // CREATE
            await axiosClient.post("/api/suppliers", values);
            message.success("Đã thêm nhà cung cấp");
          }

          const res = await fetchSuppliers({ page: 1 });
          setSuppliers(res.data ?? []);

          setOpenSupplierModal(false);
          setSelectedSupplier(null);
          supplierForm.resetFields();
        }}
      >
        <Form form={supplierForm} layout="vertical">
          {/* ===== TÊN NHÀ CUNG CẤP (CHỌN HOẶC NHẬP) ===== */}
          <Form.Item
            label="Tên nhà cung cấp"
            name="name"
            rules={[{ required: true, message: "Nhập tên nhà cung cấp" }]}
          >
            <AutoComplete
              placeholder="Nhập hoặc chọn nhà cung cấp"
              options={suppliers.map(s => ({
                value: s.name,
                label: s.name,
              }))}
              onSelect={(value) => {
                const found = suppliers.find(s => s.name === value);
                if (found) {
                  setSelectedSupplier(found);
                  supplierForm.setFieldsValue({
                    phone: found.phone ?? "",
                    email: found.email ?? "",
                  });
                }
              }}
              onChange={(value) => {
                const found = suppliers.find(s => s.name === value);
                if (!found) {
                  setSelectedSupplier(null);
                  supplierForm.setFieldsValue({
                    phone: "",
                    email: "",
                  });
                }
              }}
              filterOption={(inputValue, option) =>
                option!.value.toLowerCase().includes(inputValue.toLowerCase())
              }
            />
          </Form.Item>

          {/* ===== SĐT ===== */}
          <Form.Item name="phone" label="SĐT">
            <Input />
          </Form.Item>

          {/* ===== EMAIL ===== */}
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      </div>
    </div>
  );
}
