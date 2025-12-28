import axios from "./axios";

export const reportApi = {
  getSalesMonthly: (year: number) =>
    axios.get("/api/reports/sales/monthly", {
      params: { year },
    }),

  getSalesDaily: (month: string) =>
    axios.get("/api/reports/sales/daily", { params: { month } }),

    getTopSale: (month: string) =>
    axios.get("/api/reports/top-products", {
      params: { month },
    }),
};
