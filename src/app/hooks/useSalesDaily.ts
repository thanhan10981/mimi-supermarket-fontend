import { useEffect, useState } from "react";
import { reportApi } from "../../api/report.api";
import type { SalesDailyResponse } from "../../features/report/monthly/salesDaily";

export function useSalesDaily(month: string) {
  const [data, setData] = useState<SalesDailyResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportApi
      .getSalesDaily(month)
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, [month]);

  return { data, loading };
}
