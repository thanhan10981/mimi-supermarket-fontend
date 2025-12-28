// ===== BAR CHART =====
export interface TopSaleBarItem {
  name: string;
  revenue: number;
}

// ===== PIE CHART =====
export interface TopSalePieItem {
  name: string;
  value: number;
  [key: string]: string | number;
}


// ===== TABLE (RAW FROM BE) =====
export interface TopSaleTableItem {
  rank: number;
  name: string;
  quantity: number;
  revenue: number;
}

// ===== TABLE (UI) =====
export interface TopSaleTableRow extends TopSaleTableItem {
  avgPrice: number;
  percent: number;
}

// ===== SUMMARY =====
export interface TopSaleSummary {
  totalRevenue: number;
  totalQuantity: number;
  avgPrice: number;
}

// ===== API RESPONSE =====
export interface TopSaleApiResponse {
  barChart: TopSaleBarItem[];
  pieChart: TopSalePieItem[];
  table: TopSaleTableItem[];
}

// ===== UI RESPONSE =====
export interface TopSaleResponse {
  summary: TopSaleSummary;
  barChart: TopSaleBarItem[];
  pieChart: TopSalePieItem[];
  table: TopSaleTableRow[];
}
