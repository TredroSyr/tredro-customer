import type { iconName } from "@/assets/icons/iconRenderer/types";

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: iconName;
}

export interface CategoriesListResponse {
  success: boolean;
  message: string;
  data: { categories: Category[] };
}
