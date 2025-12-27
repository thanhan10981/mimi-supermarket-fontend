import axiosClient from "./axiosClient";

export type InventoryLogType = "import" | "export" | "adjust";

export type InventoryLogRow = {
  id: number;
  product_id: number;
  type: InventoryLogType;
  quantity: number;
  note?: string | null;
  created_at: string;

  product?: {
    id: number;
    code: string;
    name: string;
  };
};

export type PaginateResponse<T> = {
  data: T[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
};

export type FetchInventoryLogsParams = {
  page?: number;
  product_id?: number;
  type?: InventoryLogType;
};

export async function fetchInventoryLogs(params: FetchInventoryLogsParams) {
  const res = await axiosClient.get<PaginateResponse<InventoryLogRow>>(
    "/api/inventory-logs",
    { params }
  );
  return res.data;
}
