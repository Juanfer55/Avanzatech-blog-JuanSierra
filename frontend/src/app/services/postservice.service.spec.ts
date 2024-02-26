import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PostService } from './postservice.service';
import { PostListMock, PostMock, PostWithExcerptMock, PostWithoutPermissionMock } from '../testing/mocks/post.mocks';
import { environment } from '../environments/environment.api';
import { ApiResponseMock } from '../testing/mocks/apiResponse.mocks';

fdescribe('PostserviceService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;
  const postResponse = ApiResponseMock(PostListMock(10));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService],
    });
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPosts() Tests', () => {
    it('should return an Observable when succesfully get posts', (doneFn) => {
      const responseMsg = postResponse;

      service.getPosts().subscribe((response) => {
        expect(response).toEqual(responseMsg);
        expect(response.total_count).toEqual(responseMsg.total_count);
        expect(response.current_page).toEqual(responseMsg.current_page);
        expect(response.total_pages).toEqual(responseMsg.total_pages);
        expect(response.next).toEqual(responseMsg.next);
        expect(response.previous).toEqual(responseMsg.previous);
        expect(response.results).toEqual(responseMsg.results);
        doneFn();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/post/?page=1`);
      expect(req.request.method).toBe('GET');
      req.flush(responseMsg);
    });
    it('should set the postpage and totalposts when succesfully get posts', (doneFn) => {
      spyOn(service, 'setServiceinfo');
      const responseMsg = ApiResponseMock([PostWithExcerptMock()]);

      service.getPosts().subscribe((response) => {
        expect(service.setServiceinfo).toHaveBeenCalled();
        doneFn();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/post/?page=1`);
      expect(req.request.method).toBe('GET');
      req.flush(responseMsg);
    });
    it('should return an Observable when succesfully get posts with link', (doneFn) => {
      const link = `${environment.apiUrl}/post/?page=2`;
      const responseMsg = postResponse;

      service.getPosts(link).subscribe((response) => {
        expect(response).toEqual(responseMsg);
        expect(response.total_count).toEqual(responseMsg.total_count);
        expect(response.current_page).toEqual(responseMsg.current_page);
        expect(response.total_pages).toEqual(responseMsg.total_pages);
        expect(response.next).toEqual(responseMsg.next);
        expect(response.previous).toEqual(responseMsg.previous);
        expect(response.results).toEqual(responseMsg.results);
        doneFn();
      });

      const req = httpMock.expectOne(link);
      expect(req.request.method).toBe('GET');
      req.flush(responseMsg);
    });
    it('should retry the request and reset the page once if it fails', (doneFn) => {
      const responseMsg = postResponse;

      service.getPosts().subscribe((response) => {
        expect(response).toEqual(responseMsg);
        doneFn();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/post/?page=1`);
      expect(req.request.method).toBe('GET');
      req.flush('error', { status: 500, statusText: 'Server error' });

      const req2 = httpMock.expectOne(`${environment.apiUrl}/post/?page=1`);
      expect(req2.request.method).toBe('GET');
      req2.flush(responseMsg);
    });
  });
  describe('getPost() Tests', () => {
    it('should return an Observable when succesfully get post', (doneFn) => {
      const postId = 1;
      const responseMsg = PostMock();

      service.getPost(postId).subscribe((response) => {
        expect(response).toEqual(responseMsg);
        expect(response.id).toEqual(responseMsg.id);
        expect(response.title).toEqual(responseMsg.title);
        expect(response.content).toEqual(responseMsg.content);
        expect(response.content).toEqual(responseMsg.content);
        expect(response.created_at).toEqual(responseMsg.created_at);
        doneFn();
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/post/${postId}/`
      );
      expect(req.request.method).toBe('GET');
      req.flush(responseMsg);
    });
    it('should return an error if the post does not exist or the user has no read permission on it', (doneFn) => {
      const postId = 1;
      const errorMsg = 'Not found.';
      const error = {
        status: 404,
        statusText: 'Not found',
      };

      service.getPost(postId).subscribe({
        error: (err) => {
          expect(err.status).toEqual(error.status);
          expect(err.statusText).toEqual(error.statusText);
          doneFn();
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/post/${postId}/`
      );
      expect(req.request.method).toBe('GET');
      req.flush(errorMsg, error);
    });
  });
  describe('createPost() Tests', () => {
    it('should return an Observable when succesfully create post', (doneFn) => {
      const post = PostMock();
      const responseMsg = PostWithoutPermissionMock();

      service.createPost(post).subscribe((response) => {
        expect(response).toEqual(responseMsg);
        expect(response.id).toEqual(responseMsg.id);
        expect(response.title).toEqual(responseMsg.title);
        expect(response.content).toEqual(responseMsg.content);
        expect(response.created_at).toEqual(responseMsg.created_at);
        doneFn();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/post/`);
      expect(req.request.method).toBe('POST');
      req.flush(responseMsg);
    });
    it('It should return an error if the post is not valid', (doneFn) => {
      const post = PostMock();
      const errorMsg = 'Title is too long.';
      const error = {
        status: 400,
        statusText: errorMsg,
      };

      service.createPost(post).subscribe({
        error: (err) => {
          expect(err.status).toEqual(error.status);
          expect(err.statusText).toEqual(error.statusText);
          doneFn();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/post/`);
      expect(req.request.method).toBe('POST');
      req.flush(errorMsg, error);
    });
  });
  describe('deletePost() Tests', () => {
    it('should return an 204 status if the post was deleted', (doneFn) => {
      const postId = 1;
      const responseMsg = {
        status: 204,
        statusText: 'No content',
      };

      service.deletePost(postId).subscribe((response: any) => {
        expect(response.status).toEqual(responseMsg.status);
        expect(response.statusText).toEqual(responseMsg.statusText);
        doneFn();
      });

      const req = httpMock.expectOne(
        `http://127.0.0.1:8000/api/blog/${postId}/`
      );
      expect(req.request.method).toBe('DELETE');
      req.flush(responseMsg);
    });
    it('should set the postpage after delete', (doneFn) => {
      spyOn(service, 'setPostPageAfterDelete');
      const postId = 1;
      const responseMsg = {
        status: 204,
        statusText: 'No content',
      };

      service.deletePost(postId).subscribe((response) => {
        expect(service.setPostPageAfterDelete).toHaveBeenCalled();
        doneFn();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/blog/${postId}/`);
      expect(req.request.method).toBe('DELETE');
      req.flush(responseMsg);
    });
    it('should return an error if the post does not exist or the user has no delete permission on it', (doneFn) => {
      const postId = 1;
      const errorMsg = 'Not found.';
      const error = {
        status: 404,
        statusText: 'Not found',
      };

      service.deletePost(postId).subscribe({
        error: (err) => {
          expect(err.status).toEqual(error.status);
          expect(err.statusText).toEqual(error.statusText);
          doneFn();
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/blog/${postId}/`
      );

      expect(req.request.method).toBe('DELETE');
      req.flush(errorMsg, error);
    });
  });
  describe('updatePost() Tests', () => {
    it('should return an Observable when succesfully update post', (doneFn) => {
      const postId = 1;
      const post = PostMock();
      const responseMsg = PostWithoutPermissionMock();

      service.updatePost(postId, post).subscribe((response) => {
        expect(response).toEqual(responseMsg);
        expect(response.id).toEqual(responseMsg.id);
        expect(response.title).toEqual(responseMsg.title);
        expect(response.content).toEqual(responseMsg.content);
        expect(response.created_at).toEqual(responseMsg.created_at);
        doneFn();
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/blog/${postId}/`
      );

      expect(req.request.method).toBe('PUT');
      req.flush(responseMsg);
    });
    it('should return an error if the post does not exist or the user has no update permission on it', (doneFn) => {
      const postId = 1;
      const post = PostMock();
      const errorMsg = 'Not found.';
      const error = {
        status: 404,
        statusText: 'Not found',
      };

      service.updatePost(postId, post).subscribe({
        error: (err) => {
          expect(err.status).toEqual(error.status);
          expect(err.statusText).toEqual(error.statusText);
          doneFn();
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/blog/${postId}/`
      );
      expect(req.request.method).toBe('PUT');
      req.flush(errorMsg, error);
    });
  });
  describe('setPostPageAfterDelete() Tests', () => {
    it('should return the current page if the total count is greater than or equal to the min posts for the current page', (doneFn) => {
      const response = ApiResponseMock(PostListMock(20), 20, 2, 2);
      service.getPosts().subscribe(() => {
        service.setServiceinfo(response);
        service.setPostPageAfterDelete();
        expect(service.getPostPage()).toBe(response.current_page);
        doneFn();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/post/?page=1`);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    });
    it('should return the previous page if the total count is less than the min posts for the current page', (doneFn) => {
      const response = ApiResponseMock(PostListMock(20), 11, 2, 2);
      service.getPosts().subscribe(() => {
        service.setServiceinfo(response);
        service.setPostPageAfterDelete();
        expect(service.getPostPage()).toBe(response.current_page - 1);
        doneFn();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/post/?page=1`);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    });
    it('should return the page 1 if the actual page is 1', (doneFn) => {
      const response = ApiResponseMock(PostListMock(20), 11, 1, 2);
      service.getPosts().subscribe(() => {
        service.setServiceinfo(response);
        service.setPostPageAfterDelete();
        expect(service.getPostPage()).toBe(1);
        doneFn();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/post/?page=1`);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    });
  });
  describe('onResetPostState() Tests', () => {
    it('should return an Observable', () => {
      const observable = service.onResetPostState();

      expect(observable).toBeDefined();
      expect(observable.subscribe).toBeDefined();
    });
  });
  describe('resetPostState() Tests', () => {
    it('should call next() on resetPostStateSubject', () => {
      spyOn((service as any).resetPostStateSubject, 'next');

      service.resetPostState();

      expect((service as any).resetPostStateSubject.next).toHaveBeenCalled();
    });
  });
});

