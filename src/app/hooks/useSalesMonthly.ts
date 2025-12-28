import { useEffect, useState } from "react";
import { reportApi } from "../../api/report.api";

import type { SalesMonthlyResponse } from "../../features/report/monthly/type";

export function useSalesMonthly(year: number) {
  const [data, setData] = useState<SalesMonthlyResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportApi
      .getSalesMonthly(year)
      .then(res => {
        setData(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [year]);

  return { data, loading };
}

