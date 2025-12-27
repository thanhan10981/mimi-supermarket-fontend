import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8001/api";

export type Bill = {
  id: number;
  code: string;
  customer: string;
  phone: string;
  staff: string;
  total: number;
  paid: number;
  status: "PAID" | "PARTIAL" | "UNPAID";
  created_at: string;
};

export async function getBills(params?: {
  search?: string;
  status?: string;
  page?: number;
}) {
  const res = await axios.get(`${API_BASE_URL}/bills`, {
    params,
  });
  return res.data; // { data, meta, links }
}
