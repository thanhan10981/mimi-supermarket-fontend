import { useEffect, useState } from "react";
import { reportApi } from "../../api/report.api";
import type {
  TopSaleResponse,
  TopSaleApiResponse,
  TopSaleTableItem,
} from "../../features/report/monthly/topSale";

export function useTopSale(month: string) {
  const [data, setData] = useState<TopSaleResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    reportApi.getTopSale(month).then(res => {
      const raw: TopSaleApiResponse = res.data;

      const totalRevenue = raw.table.reduce(
        (sum: number, item: TopSaleTableItem) => sum + item.revenue,
        0
      );

      const totalQuantity = raw.table.reduce(
        (sum: number, item: TopSaleTableItem) => sum + item.quantity,
        0
      );

      const table = raw.table.map((item: TopSaleTableItem) => ({
        ...item,
        avgPrice: item.quantity
          ? Math.round(item.revenue / item.quantity)
          : 0,
        percent: totalRevenue
          ? Math.round((item.revenue / totalRevenue) * 100)
          : 0,
      }));

      setData({
        summary: {
          totalRevenue,
          totalQuantity,
          avgPrice: totalQuantity
            ? Math.round(totalRevenue / totalQuantity)
            : 0,
        },
        barChart: raw.barChart,
        pieChart: raw.pieChart,
        table,
      });

      setLoading(false);
    });
  }, [month]);

  return { data, loading };
}
