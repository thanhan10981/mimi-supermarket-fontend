// =========================
// SUMMARY
// =========================
export interface SalesDailySummary {
  totalRevenue: number;
  avgRevenue: number;
  totalOrders: number;
}

// =========================
// CHART
// =========================
export interface SalesDailyChartItem {
  date: string;    // "01/12"
  revenue: number;
}

// =========================
// TOP DAY ITEM
// =========================
export interface SalesDailyTopItem {
  rank: number;
  date: string;    // "01/12/2025"
  orders: number;
  revenue: number;
}

// =========================
// API RESPONSE
// =========================
export interface SalesDailyResponse {
  summary: SalesDailySummary;
  chart: SalesDailyChartItem[];
  topHighest: SalesDailyTopItem[];
  topLowest: SalesDailyTopItem[];
}

