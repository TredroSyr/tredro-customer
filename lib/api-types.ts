export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Pagination {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
}
