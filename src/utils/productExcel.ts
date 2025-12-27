import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type { ProductRow, CreateProductPayload } from "../api/product.api";

type ExcelProductRow = {
  "Mã hàng"?: string | number;
  "Tên hàng"?: string | number;
  "Category ID"?: string | number;
  "Supplier ID"?: string | number;
  "Giá vốn"?: string | number;
  "Giá bán"?: string | number;
  "Tồn kho"?: string | number;
  "Hạn dùng"?: string | number; // có thể là date excel
};

const toNumberOrNull = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const toNumber = (v: unknown, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const toStringTrim = (v: unknown): string => String(v ?? "").trim();

/** Export */
export function exportProductsToExcel(rows: ProductRow[]) {
  const data: ExcelProductRow[] = rows.map((r) => ({
    "Mã hàng": r.code,
    "Tên hàng": r.name,
    "Category ID": r.category_id ?? "",
    "Supplier ID": r.supplier_id ?? "",
    "Giá vốn": r.cost_price,
    "Giá bán": r.price,
    "Tồn kho": r.stock,
    "Hạn dùng": r.expired_at ?? "",
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Products");

  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([out], { type: "application/octet-stream" }), "products.xlsx");
}

/** Import */
export async function parseProductsExcel(file: File): Promise<CreateProductPayload[]> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const firstSheetName = wb.SheetNames[0];
  const ws = wb.Sheets[firstSheetName];
  if (!ws) return [];

 
  const json = XLSX.utils.sheet_to_json<ExcelProductRow>(ws, { defval: "" });

  return json
    .map((row): CreateProductPayload => ({
      code: toStringTrim(row["Mã hàng"]), // rỗng => BE tự sinh
      name: toStringTrim(row["Tên hàng"]),
      category_id: toNumberOrNull(row["Category ID"]),
      supplier_id: toNumberOrNull(row["Supplier ID"]),
      cost_price: toNumber(row["Giá vốn"], 0),
      price: toNumber(row["Giá bán"], 0),
      stock: toNumber(row["Tồn kho"], 0),
      expired_at: row["Hạn dùng"] ? toStringTrim(row["Hạn dùng"]) : null, // YYYY-MM-DD (nếu bạn nhập kiểu text)
    }))
    .filter((p) => p.name.length > 0); // bỏ dòng trống
}
