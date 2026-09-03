import { mockDelay } from "@/lib/mock";
import {
  Company,
  CompaniesListParams,
  CompaniesListResponse,
  CompanyDetailResponse,
} from "../types";

/** Stand-in for the eventual `/companies` endpoints. */
const MOCK_COMPANIES: Company[] = [
  {
    id: 1,
    name: "التغذية للتوزيع",
    slug: "al-taghzia",
    logo: null,
    cover: null,
    category_id: 1,
    rating: 4.6,
    distance_km: 1.2,
    is_open: true,
    description: "شركة توزيع مواد غذائية بالجملة تغطي حلب والمنطقة الصناعية.",
    governorate: "حلب",
    region: "الشيخ نجار",
    delivery_fee: "5000",
    min_order: "50000",
  },
  {
    id: 2,
    name: "الشام للمشروبات",
    slug: "al-sham-beverages",
    logo: null,
    cover: null,
    category_id: 2,
    rating: 4.3,
    distance_km: 2.8,
    is_open: true,
    description: "موزع رئيسي للمشروبات الغازية والعصائر في دمشق وريفها.",
    governorate: "دمشق",
    region: "المزة",
    delivery_fee: "3000",
    min_order: "30000",
  },
  {
    id: 3,
    name: "بيت الحلويات الشرقية",
    slug: "eastern-sweets",
    logo: null,
    cover: null,
    category_id: 5,
    rating: 4.8,
    distance_km: 0.6,
    is_open: true,
    description: "حلويات شرقية وهدايا مناسبات بالجملة والمفرق.",
    governorate: "دمشق",
    region: "باب توما",
    delivery_fee: "4000",
    min_order: "20000",
  },
  {
    id: 4,
    name: "النظافة الحديثة",
    slug: "modern-cleaning",
    logo: null,
    cover: null,
    category_id: 3,
    rating: 4.1,
    distance_km: 4.5,
    is_open: false,
    description: "مواد تنظيف ومعقمات للمحلات والمنازل بأسعار الجملة.",
    governorate: "حلب",
    region: "الفرقان",
    delivery_fee: "5000",
    min_order: "40000",
  },
  {
    id: 5,
    name: "مطبخ أم رامي",
    slug: "um-rami-kitchen",
    logo: null,
    cover: null,
    category_id: 4,
    rating: 4.9,
    distance_km: 1.9,
    is_open: true,
    description: "وجبات وأطعمة جاهزة يومياً بجودة منزلية.",
    governorate: "دمشق",
    region: "المالكي",
    delivery_fee: "2500",
    min_order: "15000",
  },
  {
    id: 6,
    name: "الأصالة لمواد البناء",
    slug: "al-asala-construction",
    logo: null,
    cover: null,
    category_id: 7,
    rating: 3.9,
    distance_km: 6.3,
    is_open: true,
    description: "مواد بناء وأدوات صحية بالجملة.",
    governorate: "حمص",
    region: "الوعر",
    delivery_fee: "8000",
    min_order: "100000",
  },
];

export async function getCompanies(
  params: CompaniesListParams = {},
): Promise<CompaniesListResponse> {
  let companies = MOCK_COMPANIES;
  if (params.category_id) {
    companies = companies.filter((c) => c.category_id === params.category_id);
  }
  if (params.q) {
    const q = params.q.trim().toLowerCase();
    companies = companies.filter((c) => c.name.toLowerCase().includes(q));
  }

  const data = await mockDelay(companies, 500);
  return {
    success: true,
    message: "",
    data: {
      companies: data,
      pagination: {
        count: data.length,
        page: 1,
        page_size: data.length,
        total_pages: 1,
      },
    },
  };
}

export async function getCompanyById(id: number): Promise<CompanyDetailResponse> {
  const company = MOCK_COMPANIES.find((c) => c.id === id);
  const data = await mockDelay(company, 400);
  if (!data) {
    throw new Error("الشركة غير موجودة");
  }
  return { success: true, message: "", data: { company: data } };
}
