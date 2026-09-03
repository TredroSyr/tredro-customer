import { mockDelay } from "@/lib/mock";
import {
  Product,
  ProductsListParams,
  ProductsListResponse,
  ProductDetailResponse,
} from "../types";

/** Stand-in for the eventual `/companies/:id/products` endpoints. */
const PRODUCT_NAMES_BY_CATEGORY: Record<number, string[]> = {
  1: ["أرز أبو كف 5 كغ", "سكر أبيض 1 كغ", "زيت دوار الشمس 1.5 لتر", "معكرونة اسباغيتي 400غ"],
  2: ["عصير برتقال 1 لتر", "مياه معدنية 1.5 لتر (×6)", "مشروب غازي 2.25 لتر", "شاي أحمر 100 كيس"],
  3: ["منظف أرضيات 3 لتر", "صابون غسيل يدين 500 مل", "معقم أسطح 1 لتر"],
  4: ["وجبة فروج مع رز", "طبق كبة مقلية", "صحن فتوش"],
  5: ["علبة بقلاوة 1 كغ", "معمول بالفستق 500غ", "شوكولا مشكلة"],
  6: ["طقم أكواب زجاج", "مكنسة أرضية", "سلة غسيل بلاستيك"],
  7: ["كيس اسمنت 50 كغ", "أنبوب PVC 4 إنش", "دهان جدران أبيض 18 لتر"],
  8: ["منتج متنوع 1", "منتج متنوع 2"],
};

function buildCatalog(companyId: number, categoryId: number): Product[] {
  const names = PRODUCT_NAMES_BY_CATEGORY[categoryId] ?? PRODUCT_NAMES_BY_CATEGORY[1];
  return names.map((name, index) => ({
    id: companyId * 100 + index + 1,
    company_id: companyId,
    category_id: categoryId,
    name,
    sku: `SKU-${companyId}${index + 1}`,
    image: null,
    unit_name: "قطعة",
    price: String(5000 + index * 2500 + companyId * 500),
    description: `${name} — منتج متوفر لدى هذه الشركة بجودة عالية وسعر جملة تنافسي.`,
    is_available: true,
  }));
}

// company_id -> category_id, matches module/companies/api's MOCK_COMPANIES.
const COMPANY_CATEGORY: Record<number, number> = {
  1: 1,
  2: 2,
  3: 5,
  4: 3,
  5: 4,
  6: 7,
};

const allProducts: Product[] = Object.entries(COMPANY_CATEGORY).flatMap(
  ([companyId, categoryId]) => buildCatalog(Number(companyId), categoryId),
);

export async function getProductsByCompany(
  companyId: number,
  params: ProductsListParams = {},
): Promise<ProductsListResponse> {
  let products = allProducts.filter((p) => p.company_id === companyId);
  if (params.category_id) {
    products = products.filter((p) => p.category_id === params.category_id);
  }
  if (params.q) {
    const q = params.q.trim().toLowerCase();
    products = products.filter((p) => p.name.toLowerCase().includes(q));
  }

  const data = await mockDelay(products, 450);
  return {
    success: true,
    message: "",
    data: {
      products: data,
      pagination: { count: data.length, page: 1, page_size: data.length, total_pages: 1 },
    },
  };
}

export async function getProductById(id: number): Promise<ProductDetailResponse> {
  const product = allProducts.find((p) => p.id === id);
  const data = await mockDelay(product, 350);
  if (!data) {
    throw new Error("المنتج غير موجود");
  }
  return { success: true, message: "", data: { product: data } };
}
