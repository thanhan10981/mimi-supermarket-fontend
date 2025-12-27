import axiosClient from "./axiosClient";

export type ProductQuery = {
  page?: number;
  per_page?: number;
  keyword?: string;
  status?: "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";
  category_id?: number;
  supplier_id?: number;
  min_price?: number;
  max_price?: number;
  created_from?: string; // YYYY-MM-DD
  created_to?: string;   // YYYY-MM-DD
};

export type ProductRow = {
  id: number;
  code: string;
  name: string;

  category_id: number | null;
  supplier_id: number | null;

  price: number;
  cost_price: number;
  stock: number;

  created_at: string;
  expired_at?: string | null;

  category?: { id: number; code: string; name: string; type: string } | null;
  supplier?: { id: number; name: string; phone?: string | null; email?: string | null } | null;

  primary_image?: { id: number; product_id: number; path: string; is_primary: number | boolean } | null;
};

export type Paginate<T> = {
  current_page: number;
  data: T[];
  per_page: number;
  total: number;
  last_page: number;
};

export async function fetchProducts(params?: ProductQuery) {
  const res = await axiosClient.get<Paginate<ProductRow>>("/api/products", { params });
  return res.data;
}

export type CreateProductPayload = {
  code: string;
  name: string;
  category_id?: number | null;
  supplier_id?: number | null;
  price: number;
  cost_price: number;
  stock: number;
  expired_at?: string | null; // YYYY-MM-DD
};

export async function createProduct(payload: CreateProductPayload) {
  const res = await axiosClient.post<ProductRow>("/api/products", payload);
  return res.data;
}

export async function uploadProductImage(productId: number, file: File, isPrimary = true) {
  const fd = new FormData();
  fd.append("image", file);
  fd.append("is_primary", isPrimary ? "1" : "0");

  const res = await axiosClient.post(`/api/products/${productId}/images`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function fetchNextProductCode() {
  const res = await axiosClient.get("/api/products/next-code");
  return res.data.code as string;
}

// cập nhật 
export type UpdateProductPayload = Partial<CreateProductPayload>;

export async function updateProduct(id: number, payload: UpdateProductPayload) {
  const res = await axiosClient.put<ProductRow>(`/api/products/${id}`, payload);
  return res.data;
}

//xóa
export async function deleteProduct(id: number) {
  const res = await axiosClient.delete<{ message: string }>(`/api/products/${id}`);
  return res.data;
}