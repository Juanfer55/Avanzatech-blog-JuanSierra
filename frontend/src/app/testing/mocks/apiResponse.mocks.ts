import { faker } from '@faker-js/faker';
import { ApiResponse } from '../../models/api-respond.model';

export const ApiResponseMock = (data: any[]): ApiResponse<any> => {
  return {
    total_count: 1,
    current_page: 1,
    total_pages: 2,
    next: 'http://127.0.0.1:8000/api/post/?page=2',
    previous: 'http://127.0.0.1:8000/api/post/?page=1',
    results: data,
  }
};


