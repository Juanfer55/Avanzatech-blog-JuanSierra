export interface ApiResponse<T> {
  total_count: number;
  current_page: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
