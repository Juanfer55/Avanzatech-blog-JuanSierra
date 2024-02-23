import { ApiResponse } from '../../models/api-respond.model';

export const ApiResponseMock = (
  data: any[],
  total_count?: number,
  current_page?: number,
  total_pages?: number,
  next?: string,
  previous?: string,
): ApiResponse<any> => {
  return {
    total_count: total_count || 1,
    current_page: current_page || 1,
    total_pages: total_pages || 2,
    next: next || 'link-next-page',
    previous: previous || 'link-previous-page',
    results: data,
  };
};
