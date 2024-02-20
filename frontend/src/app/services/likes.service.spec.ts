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

  describe('getPostLikes() Tests', () => {
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

    it('should return an error if the post does not exist or the user has no read permission on it', (doneFn) => {
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
  describe('getLikePage() Tests', () => {
    it('should return an Observable when succesfully get likes page', (doneFn) => {
      const likePage = 'http://127.0.0.1:8000/api/like/?post=1/?page=2/';
      const responseMsg = {
        total_count: 2,
        current_page: 2,
        total_pages: 2,
        next: null,
        previous: 'http://127.0.0.1:8000/api/like/?page=1/',
        results: [LikeMock()],
      };

      service.getLikePage(likePage).subscribe((response) => {
        expect(response).toEqual(responseMsg);
        expect(response.total_count).toEqual(responseMsg.total_count);
        expect(response.current_page).toEqual(responseMsg.current_page);
        expect(response.total_pages).toEqual(responseMsg.total_pages);
        expect(response.next).toEqual(responseMsg.next);
        expect(response.previous).toEqual(responseMsg.previous);
        expect(response.results).toEqual(responseMsg.results);
        doneFn();
      });

      const req = httpMock.expectOne(likePage);
      expect(req.request.method).toBe('GET');
      req.flush(responseMsg);
    });

    it('should return an error if the post does not exist or the user has no read permission on it', (doneFn) => {
      const likePage = 'http://127.0.0.1:8000/api/like/?post=1/?page=2/';
      const responseMsg = 'Not Found.';
      const errorMsg = {
        status: 404,
        statusText: responseMsg,
      };

      service.getLikePage(likePage).subscribe({
        error: (err) => {
          expect(err.status).toEqual(errorMsg.status);
          expect(err.statusText).toEqual(errorMsg.statusText);
          doneFn();
        },
      });

      const req = httpMock.expectOne(likePage);
      expect(req.request.method).toBe('GET');
      req.flush(responseMsg, errorMsg);
    });
  });

  describe('getUserLike() Tests', () => {
    it('should return an Observable when succesfully get user like for the post', (doneFn) => {
      const userId = 1;
      const postId = 1;
      const responseMsg = {
        total_count: 1,
        current_page: 1,
        total_pages: 1,
        next: null,
        previous: null,
        results: [LikeMock()],
      };

      service.getUserLike(userId, postId).subscribe((response) => {
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
        `http://127.0.0.1:8000/api/like/?user=${userId}&post=${postId}`
      );

      expect(req.request.method).toBe('GET');
      req.flush(responseMsg);
    });
    it('should return an error if the post does not exist or the user has no read permission on it', (doneFn) => {
      const userId = 1;
      const postId = 1;
      const responseMsg = 'Not Found.';
      const errorMsg = {
        status: 404,
        statusText: responseMsg,
      };

      service.getUserLike(userId, postId).subscribe({
        error: (err) => {
          expect(err.status).toEqual(errorMsg.status);
          expect(err.statusText).toEqual(errorMsg.statusText);
          doneFn();
        },
      });

      const req = httpMock.expectOne(
        `http://127.0.0.1:8000/api/like/?user=${userId}&post=${postId}`
      );

      expect(req.request.method).toBe('GET');
      req.flush(responseMsg, errorMsg);
    });
  });
  describe('likePost Tests', () => {
    it('should return an Observable when succesfully create a like', (doneFn) => {
      const postId = 1;
      const responseMsg = LikeMock();

      service.likePost(postId).subscribe((response) => {
        expect(response).toEqual(responseMsg);
        doneFn();
      });

      const req = httpMock.expectOne(`http://127.0.0.1:8000/api/like/`);

      expect(req.request.method).toBe('POST');
      req.flush(responseMsg);
    });

    it('should return an error if the post does not exist or the user has no read permission on it', (doneFn) => {
      const postId = 1;
      const responseMsg = 'Not Found.';
      const errorMsg = {
        status: 404,
        statusText: responseMsg,
      };

      service.likePost(postId).subscribe({
        error: (err) => {
          expect(err.status).toEqual(errorMsg.status);
          expect(err.statusText).toEqual(errorMsg.statusText);
          doneFn();
        },
      });

      const req = httpMock.expectOne(`http://127.0.0.1:8000/api/like/`);

      expect(req.request.method).toBe('POST');
      req.flush(responseMsg, errorMsg);
    });
  });
  describe('unLikePost() Tests', () => {
    it('should return an Observable when succesfully delete a like', (doneFn) => {
      const likeId = 1;
      const errorMsg = {
        status: 204,
      };

      service.UnlikePost(likeId).subscribe((response) => {
        expect(response).toEqual(errorMsg);
        doneFn();
      });

      const req = httpMock.expectOne(
        `http://127.0.0.1:8000/api/like/${likeId}`
      );

      expect(req.request.method).toBe('DELETE');
      req.flush(errorMsg);
    });
    it('should return an error if the like does not exist', (doneFn) => {
      const likeId = 1;
      const responseMsg = 'Not Found.';
      const errorMsg = {
        status: 404,
        statusText: responseMsg,
      };

      service.UnlikePost(likeId).subscribe({
        error: (err) => {
          expect(err.status).toEqual(errorMsg.status);
          expect(err.statusText).toEqual(errorMsg.statusText);
          doneFn();
        },
      });

      const req = httpMock.expectOne(
        `http://127.0.0.1:8000/api/like/${likeId}`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush(responseMsg, errorMsg);
    });
  });
});
