import axiosClient from "./axiosClient";

export type Category = { id: number; code: string; name: string; type: string };

export async function fetchCategories(params?: { keyword?: string; type?: string; page?: number }) {
  const res = await axiosClient.get("/api/categories", { params });
  return res.data; // paginate
}
