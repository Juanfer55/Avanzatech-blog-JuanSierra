// angular
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
// service
import { LikesService } from './likes.service';
// mocks
import { LikeMock } from '../testing/mocks/like.mocks';

fdescribe('LikesService', () => {
  let service: LikesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LikesService],
    });
    service = TestBed.inject(LikesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Get Likes Tests', () => {
    it('should return an Observable when succesfully get likes', (doneFn) => {
      const postId = 1;
      const responseMsg = {
        total_count: 1,
        current_page: 1,
        total_pages: 1,
        next: null,
        previous: null,
        results: [LikeMock()],
      };

      service.getPostLikes(postId).subscribe((response: any) => {
        expect(response).toEqual(responseMsg);
        expect(response.total_count).toEqual(responseMsg.total_count);
        expect(response.current_page).toEqual(responseMsg.current_page);
        expect(response.total_pages).toEqual(responseMsg.total_pages);
        expect(response.next).toEqual(responseMsg.next);
        expect(response.previous).toEqual(responseMsg.previous);
        expect(response.results).toEqual(responseMsg.results);
        doneFn();
      });

      const req = httpMock.expectOne(
        'http://127.0.0.1:8000/api/like/?post=' + postId
      );
      expect(req.request.method).toBe('GET');
      req.flush(responseMsg);
    });

    it('should return an error when get likes fails', (doneFn) => {
      const postId = 1;
      const responseMsg = 'Not Found.';
      const errorMsg = {
        status: 404,
        statusText: responseMsg,
      };

      service.getPostLikes(postId).subscribe({
        error: (err) => {
          expect(err.status).toEqual(errorMsg.status);
          expect(err.statusText).toEqual(errorMsg.statusText);
          doneFn();
        },
      });

      const req = httpMock.expectOne(
        'http://127.0.0.1:8000/api/like/?post=' + postId
      );

      expect(req.request.method).toBe('GET');
      req.flush(responseMsg, errorMsg);
    });
  });

  
});
