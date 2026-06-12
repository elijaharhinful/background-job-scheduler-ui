export interface ApiResponse<T> {
  success:    boolean;
  message:    string;
  data:       T;
  status_code: number;
  timestamp:  string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<PaginatedData<T>> {}

export interface PaginatedData<T> {
  data:       T[];
  total:      number;
  page:       number;
  limit:      number;
  total_pages: number;
}
