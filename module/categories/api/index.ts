import { mockDelay } from "@/lib/mock";
import { Category, CategoriesListResponse } from "../types";

/** Stand-in for the eventual `/categories` endpoint. */
const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "مواد غذائية", slug: "groceries", icon: "cart_outlined" },
  { id: 2, name: "مشروبات", slug: "beverages", icon: "drip_outlined" },
  { id: 3, name: "منظفات", slug: "cleaning", icon: "health_outlined" },
  { id: 4, name: "مطاعم وأطعمة جاهزة", slug: "food", icon: "cooking_outlined" },
  { id: 5, name: "هدايا وحلويات", slug: "sweets", icon: "gift_outlined" },
  { id: 6, name: "أدوات منزلية", slug: "household", icon: "home_outlined" },
  { id: 7, name: "مواد بناء", slug: "construction", icon: "store_outlined" },
  { id: 8, name: "أخرى", slug: "other", icon: "category_filled" },
];

export async function getCategories(): Promise<CategoriesListResponse> {
  const data = await mockDelay(MOCK_CATEGORIES, 400);
  return { success: true, message: "", data: { categories: data } };
}
