export interface SalesMonthlySummary {
  totalRevenue: number;
  avgRevenue: number;
  totalOrders: number;
}

export interface SalesMonthlyChartItem {
  month: string;
  revenue: number;
}

export interface SalesMonthlyTableItem {
  month: string;
  revenue: number;
  orders: number;
}

export interface SalesMonthlyResponse {
  summary: SalesMonthlySummary;
  chart: SalesMonthlyChartItem[];
  table: SalesMonthlyTableItem[];
}
