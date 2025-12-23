import { Card, Col, Row } from "antd";
import type { Product } from "./pos.types";

interface Props {
  products: Product[];
  onAdd: (p: Product) => void;
}

export default function ProductGrid({ products, onAdd }: Props) {
  return (
    <div style={{ flex: 1, padding: 16 }}>
      <Row gutter={[16, 16]}>
        {products.map((p) => (
          <Col span={6} key={p.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={p.name}
                  src={p.image}
                  style={{ height: 120, objectFit: "contain" }}
                />
              }
              onClick={() => onAdd(p)}
            >
              <Card.Meta
                title={p.name}
                description={
                  <strong style={{ color: "#1677ff" }}>
                    {p.price.toLocaleString()} đ
                  </strong>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
