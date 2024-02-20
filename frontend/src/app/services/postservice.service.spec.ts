// angular
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
// service
import { PostService } from './postservice.service';
// mocks
import { PostMock, PostWithExcerptMock } from '../testing/mocks/post.mocks';
import { de } from '@faker-js/faker';

fdescribe('PostserviceService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

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
      const responseMsg = {
        total_count: 1,
        current_page: 1,
        total_pages: 1,
        next: null,
        previous: null,
        results: [PostWithExcerptMock()],
      };

      service.getPosts().subscribe((response: any) => {
        expect(response).toEqual(responseMsg);
        expect(response.total_count).toEqual(responseMsg.total_count);
        expect(response.current_page).toEqual(responseMsg.current_page);
        expect(response.total_pages).toEqual(responseMsg.total_pages);
        expect(response.next).toEqual(responseMsg.next);
        expect(response.previous).toEqual(responseMsg.previous);
        expect(response.results).toEqual(responseMsg.results);
        doneFn();
      });

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/post/');
      expect(req.request.method).toBe('GET');
      req.flush(responseMsg);
    });
    it('should return an Observable when succesfully get posts with page', (doneFn) => {
      const link = 'http://127.0.0.1:8000/api/post/?page=2';
      const responseMsg = {
        total_count: 1,
        current_page: 1,
        total_pages: 1,
        next: null,
        previous: null,
        results: [PostWithExcerptMock()],
      };

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
        `http://127.0.0.1:8000/api/post/${postId}/`
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
        `http://127.0.0.1:8000/api/post/${postId}/`
      );
      expect(req.request.method).toBe('GET');
      req.flush(errorMsg, error);
    });
  });
  describe('createPost() Tests', () => {
    it('should return an Observable when succesfully create post', (doneFn) => {
      const post = PostMock();
      const responseMsg = {
        id: post.id,
        title: post.title,
        content: post.content,
        created_at: post.created_at,
        author: post.author,
      };

      service.createPost(post).subscribe((response) => {
        expect(response).toEqual(responseMsg);
        expect(response.id).toEqual(responseMsg.id);
        expect(response.title).toEqual(responseMsg.title);
        expect(response.content).toEqual(responseMsg.content);
        expect(response.created_at).toEqual(responseMsg.created_at);
        doneFn();
      });

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/post/');
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

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/post/');
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
        `http://127.0.0.1:8000/api/blog/${postId}/`
      );

      expect(req.request.method).toBe('DELETE');
      req.flush(errorMsg, error);
    });
  });
  describe('updatePost() Tests', () => {
    it('should return an Observable when succesfully update post', (doneFn) => {
      const postId = 1;
      const post = PostMock();
      const responseMsg = {
        id: post.id,
        title: post.title,
        content: post.content,
        created_at: post.created_at,
        author: post.author,
      };

      service.updatePost(postId, post).subscribe((response) => {
        expect(response).toEqual(responseMsg);
        expect(response.id).toEqual(responseMsg.id);
        expect(response.title).toEqual(responseMsg.title);
        expect(response.content).toEqual(responseMsg.content);
        expect(response.created_at).toEqual(responseMsg.created_at);
        doneFn();
      });

      const req = httpMock.expectOne(
        `http://127.0.0.1:8000/api/blog/${postId}/`
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
        `http://127.0.0.1:8000/api/blog/${postId}/`
      );
      expect(req.request.method).toBe('PUT');
      req.flush(errorMsg, error);
    });
  });
});
