import { Card, Row, Col } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";

import type { TopSaleBarItem, TopSalePieItem } from "../../monthly/topSale";

// ===== PROPS =====
interface TopSaleChartProps {
  bar: TopSaleBarItem[];
  pie: TopSalePieItem[];
}
export default function TopSaleChart({ bar, pie }: TopSaleChartProps) {
  const COLORS = [
    "#1677ff",
    "#52c41a",
    "#faad14",
    "#eb2f96",
    "#13c2c2",
    "#999",
  ];
  const renderLabel = (props: PieLabelRenderProps) => {
    const {
      cx,
      cy,
      midAngle,
      outerRadius,
      percent,
    } = props;

    if (
      cx === undefined ||
      cy === undefined ||
      midAngle === undefined ||
      outerRadius === undefined ||
      percent === undefined
    ) {
      return null;
    }

    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 18; // đẩy chữ ra ngoài pie
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {(percent * 100).toFixed(1)}%
      </text>
    );
  };


  return (
    <Row gutter={24}>
      {/* ===== BAR ===== */}
      <Col span={12}>
        <Card title="Top 5 món theo doanh thu">
          <ResponsiveContainer height={300}>
            <BarChart layout="vertical" data={bar}>
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Bar dataKey="revenue" fill="#1677ff" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>

      {/* ===== PIE ===== */}
      <Col span={12}>
        <Card title="Tỷ trọng doanh thu">
          <ResponsiveContainer height={300}>
            <PieChart>
            <Pie
              data={pie}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              outerRadius={100}
              label={renderLabel}
              labelLine={true}   // ✅ bật đường dẫn
            >

                {pie.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                  />
                ))}
              </Pie>

              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
              />
            </PieChart>

          </ResponsiveContainer>
        </Card>
      </Col>
    </Row>
  );
}
