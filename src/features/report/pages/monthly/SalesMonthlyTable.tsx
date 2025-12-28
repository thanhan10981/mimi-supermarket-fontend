import { Table } from "antd";
import type { SalesMonthlyTableItem } from "../../monthly/type";
import "../../css/sales-monthlytable.css";

export default function SalesMonthlyTable({
  data,
}: {
  data: SalesMonthlyTableItem[];
}) {
  return (
    <Table
      className="sales-table"
      rowKey="month"
      dataSource={data}
      pagination={false}
      columns={[
        {
          title: "Tháng",
          dataIndex: "month",
        },
        {
          title: "Doanh thu",
          dataIndex: "revenue",
          render: (value) => (
            <span className="revenue-cell">
              {value.toLocaleString()} đ
            </span>
          ),
        },
        {
          title: "Số đơn",
          dataIndex: "orders",
          render: (value) => (
            <span className="orders-cell">
              {value.toLocaleString()}
            </span>
          ),
        },
      ]}
    />
  );
}
