import {Card,Input,Select,Radio,InputNumber,DatePicker,Button,Space,Table,Image, Modal, Form,} from "antd";
import "./product.css";
import {UploadOutlined,DownloadOutlined, SearchOutlined,} from "@ant-design/icons";
import { useState, type Key } from "react";
import { DeleteOutlined } from "@ant-design/icons";



const { RangePicker } = DatePicker;

const mockData = [
  {
    id: 1,
    code: "SP001",
    name: "Lốc máy Toyota Vios",
    price_sell: 500000,
    price_cost: 400000,
    stock: 495,
    created_at: "01/01/0001",
    expired_at: "01/01/0001",
    category: "LH001",
    image: "/assets/vios-engine.png",
  },
  {
    id: 2,
    code: "SP002",
    name: "Dầu nhớt Castrol 10W40",
    price_sell: 200000,
    price_cost: 150000,
    stock: 194,
    created_at: "02/01/2025",
    expired_at: "02/01/2025",
    category: "LH002",
    image: "/assets/oil.png",
  },
];


export default function Product() {
  const [openForm, setOpenForm] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
        setSelectedRowKeys(keys);
    },
    };

  return (

    <div className="product-page">
      {/* ===== SIDEBAR ===== */}
      <div className="product-filter">
        <Card>
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            {/* ===== SEARCH BOX ===== */}
            <div className="product-search-box">
            <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="Tìm theo mã, tên hàng, IMEI..."
                className="product-search-input"
            />
            </div>

            <div className="product-filter-label">Loại Hàng</div>
            <Select
              style={{ width: "100%" }}
              placeholder="Loại hàng"
              defaultValue="ALL"
              allowClear
              options={[
                { value: "ALL", label: "Tất cả" },
                { value: "Combo", label: "Combo" },
                { value: "Thường", label: "Thường" },
                { value: "IMEI", label: "IMEI / Serial" },
                { value: "Dịch vụ", label: "Dịch vụ" },
              ]}
            />

            <div>
              <div className="product-filter-label">Trạng thái hàng</div>
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="ALL">Tất cả</Radio>
                  <Radio value="IN_STOCK">Còn hàng</Radio>
                  <Radio value="OUT_OF_STOCK">Hết hàng</Radio>
                  <Radio value="LOW_STOCK">Sắp hết hàng</Radio>
                </Space>
              </Radio.Group>
            </div>
            <div className="product-filter-label">Nhóm Hàng</div>
            <Select
              style={{ width: "100%" }}
              placeholder="Nhóm hàng"
              allowClear
              options={[
                { value: "Phụ tùng", label: "Phụ tùng" },
                { value: "Dầu nhớt", label: "Dầu nhớt" },
                { value: "Điện gia dụng", label: "Điện gia dụng" },
              ]}
            />

            <div>
              <div className="product-filter-label">Giá bán</div>
              <Space>
                <InputNumber placeholder="Từ" style={{ width: "100%" }} />
                <InputNumber placeholder="Đến" style={{ width: "100%" }} />
              </Space>
            </div>

            <div>
              <div className="product-filter-label">Ngày tạo</div>
              <RangePicker style={{ width: "100%" }} />
            </div>
          </Space>
        </Card>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="product-content">
        <div className="product-header">
  <h2>Hàng hóa</h2>

  <div className="product-header-actions">
    {selectedRowKeys.length > 1 && (
      <Button
        danger
        icon={<DeleteOutlined />}
        className="product-delete-btn"
        >
        Xóa ({selectedRowKeys.length})
        </Button>
    )}
    <Button
      type="primary"
      icon={<span style={{ fontSize: 16 }}>＋</span>}
      onClick={() => setOpenForm(true)}
    >
      Thêm mới
    </Button>

    <Button icon={<UploadOutlined />}>
      Import
    </Button>

    <Button icon={<DownloadOutlined />}>
      Export
    </Button>

  </div>
</div>


        <Table
        rowSelection={rowSelection}
        scroll={{ y: 600 }}
        pagination={false}
  className="product-table"
  dataSource={mockData}
  rowKey="id"
  
  expandable={{
    expandRowByClick: true,
    expandedRowRender: (r) => (
      <div className="product-detail">
        <div className="product-detail-header">
          <span>{r.name}</span>
          <div>
            <Button type="primary">Cập nhật</Button>
            <Button danger style={{ marginLeft: 8 }}>
              Xóa
            </Button>
          </div>
        </div>

        <div className="product-detail-body">
          <Image width={160} src={r.image} />

          <div className="product-detail-info">
            <p><b>Mã hàng:</b> {r.code}</p>
            <p><b>Loại hàng:</b> {r.category}</p>
            <p><b>Giá bán:</b> {r.price_sell.toLocaleString()}đ</p>
            <p><b>Giá vốn:</b> {r.price_cost.toLocaleString()}đ</p>
            <p><b>Tồn kho:</b> {r.stock}</p>
          </div>

          <div className="product-detail-info">
            <p><b>Tồn kho:</b> {r.stock}</p>
            <p><b>Thời gian tạo:</b> {r.created_at}</p>
            <p><b>Dự kiến hết:</b> {r.expired_at}</p>
          </div>
        </div>

        <div className="product-detail-footer">
          <span>✔ Tổng 192</span>
          <span>Tồn kho: 4</span>
          <span>Tối sừng tạo 02/01/2025</span>
        </div>
      </div>
    ),
  }}
  columns={[
    {
      title: "Mã hàng",
      dataIndex: "code",
      width: 100,
    },
    {
      title: "Tên hàng",
      dataIndex: "name",
      render: (_, r) => (
        <div className="product-name">
          <Image width={36} src={r.image} />
          {r.name}
        </div>
      ),
      width: 260,
    },
    {
      title: "Giá bán",
      dataIndex: "price_sell",
      render: (v) => `${v.toLocaleString()}đ`,
    },
    {
      title: "Giá vốn",
      dataIndex: "price_cost",
      render: (v) => `${v.toLocaleString()}đ`,
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
    },
    {
      title: "Thời gian tạo",
      dataIndex: "created_at",
    },
    {
      title: "Dự kiến hết",
      dataIndex: "expired_at",
    },
  ]}
/>



        {/* ===== MODAL ===== */}
        <Modal
  open={openForm}
  title="Thêm mới hàng hóa"
  onCancel={() => setOpenForm(false)}
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
          Dung lượng tối đa 2MB<br />
          Định dạng: JPG, PNG
        </div>
        <Button type="primary" className="upload-btn">
          Tải ảnh lên
        </Button>
      </div>
    </div>

    {/* RIGHT – FORM */}
    <div className="add-product-form">
      <Form layout="vertical">
        <Form.Item
          label="Mã hàng"
          required
        >
          <Input placeholder="Nhập mã hàng" />
        </Form.Item>

        <Form.Item
          label="Loại hàng"
          required
        >
          <Select
            defaultValue="Combo"
            options={[
              { value: "Combo", label: "Combo" },
              { value: "Thường", label: "Thường" },
              { value: "IMEI", label: "IMEI / Serial" },
              { value: "Dịch vụ", label: "Dịch vụ" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Tên hàng"
          required
        >
          <Input placeholder="Nhập tên hàng" />
        </Form.Item>

        <Form.Item label="Nhóm hàng">
          <Select defaultValue="ALL">
            <Select.Option value="ALL">Tất cả</Select.Option>
          </Select>
        </Form.Item>

        <div className="price-row">
          <Form.Item label="Giá vốn">
            <InputNumber
              style={{ width: "100%" }}
              addonAfter="đ"
              min={0}
            />
          </Form.Item>

          <Form.Item label="Giá bán" required>
            <InputNumber
              style={{ width: "100%" }}
              addonAfter="đ"
              min={0}
            />
          </Form.Item>
        </div>

        <Form.Item label="Tồn kho ban đầu">
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
      </Form>
    </div>
  </div>

  {/* FOOTER */}
  <div className="add-product-footer">
    <Button onClick={() => setOpenForm(false)}>Hủy bỏ</Button>
    <Button type="primary">Thêm mới</Button>
  </div>
</Modal>

      </div>
    </div>
    //  </>
  );
}
