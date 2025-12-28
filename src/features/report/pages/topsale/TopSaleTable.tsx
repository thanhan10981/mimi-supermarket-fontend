import { Card, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TopSaleTableRow } from "../../monthly/topSale";
import "../../css/topsale/top-saletable.css";

// ===== PROPS =====
interface TopSaleTableProps {
  data: TopSaleTableRow[];
}

export default function TopSaleTable({ data }: TopSaleTableProps) {
  const columns: ColumnsType<TopSaleTableRow> = [
    { title: "#", dataIndex: "rank" },
    { title: "Tên món", dataIndex: "name" },
    { title: "Số lượng", dataIndex: "quantity" },
    { title: "Doanh thu", dataIndex: "revenue" },
    { title: "Giá TB", dataIndex: "avgPrice" },
    {
      title: "% tổng",
      dataIndex: "percent",
      render: (v: number) => `${v}%`,
    },
  ];

  return (
    <Card title="Chi tiết 10 món bán chạy" className="top-sale-table-card">
      <Table<TopSaleTableRow>
        rowKey="rank"
        pagination={false}
        columns={columns}
        dataSource={data}
      />
    </Card>
  );
}
