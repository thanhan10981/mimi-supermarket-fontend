import axiosClient from "./axiosClient";

export type Supplier = { id: number; name: string; phone?: string | null; email?: string | null };

export async function fetchSuppliers(params?: { keyword?: string; page?: number }) {
  const res = await axiosClient.get("/api/suppliers", { params });
  return res.data; // paginate
}
