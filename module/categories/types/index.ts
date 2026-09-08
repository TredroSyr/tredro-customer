export interface Category {
  id: number;
  name: string;
  parent: number | null;
  parent_name: string | null;
  products_count: number;
}

export interface CategoriesListResponse {
  success: boolean;
  message: string;
  data: { categories: Category[] };
}
