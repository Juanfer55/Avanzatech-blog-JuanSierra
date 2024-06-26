import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CommentsService } from './comments.service';
import { CommentMock, CommentListMock } from '../testing/mocks/comment.mocks';
import { ApiResponseMock } from '../testing/mocks/apiResponse.mocks';
import { environment } from '../environments/environment.api';

describe('CommentsService', () => {
  let service: CommentsService;
  let httpMock: HttpTestingController;
  const commentResponse = ApiResponseMock(CommentListMock(5));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentsService],
    });
    service = TestBed.inject(CommentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getComments() Tests', () => {
    it('should return an Observable when succesfully get comments', (doneFn) => {
      const postId = 1;
      const responseMsg = commentResponse;

      service.getComments(postId).subscribe((response: any) => {
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
        `${environment.apiUrl}/comment/?post=${postId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(responseMsg);
    });

    it('should return an error if the post does not exist or the user has no read permission on it', (doneFn) => {
      const postId = 1;
      const errorMsg = 'Not found.';
      const error = {
        status: 404,
        statusText: errorMsg,
      };

      service.getComments(postId).subscribe({
        error: (err) => {
          expect(err.status).toEqual(error.status);
          expect(err.statusText).toEqual(error.statusText);
          doneFn();
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/comment/?post=${postId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(errorMsg, error);
    });
  });
  describe('getCommentPage() Tests', () => {
    it('should return an Observable when succesfully get comments page', (doneFn) => {
      const postId = 1;
      const link = `${environment.apiUrl}/comment/?post=${postId}/?page=2`
      const responseMsg = commentResponse;

      service.getCommentPage(link).subscribe((response) => {
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

    it('should return an error if the post does not exist or the user has no read permission on it', (doneFn) => {
      const postId = 1;
      const link = `${environment.apiUrl}/comment/?post=${postId}/?page=2`
      const errorMsg = 'Not found.';
      const error = {
        status: 404,
        statusText: errorMsg,
      };

      service.getCommentPage(link).subscribe({
        error: (err) => {
          expect(err.status).toEqual(error.status);
          expect(err.statusText).toEqual(error.statusText);
          doneFn();
        },
      });

      const req = httpMock.expectOne(link);
      expect(req.request.method).toBe('GET');
      req.flush(errorMsg, error);
    });
  });

  describe('createComment() Tests', () => {
    it('should return an Observable when succesfully create comment', (doneFn) => {
      const postId = 1;
      const responseMsg = CommentMock();
      const content = responseMsg.content;

      service.createComment(postId, content).subscribe((response: any) => {
        expect(response).toEqual(responseMsg);
        expect(response.content).toEqual(responseMsg.content);
        doneFn();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/comment/`);

      expect(req.request.method).toBe('POST');
      req.flush(responseMsg);
    });

    it('should return error on create comment failure', (doneFn) => {
      const postId = 1;
      const content = '';
      const errormsg = 'Content is required';
      const error = {
        status: 400,
        statusText: errormsg,
      };

      service.createComment(postId, content).subscribe({
        error: (err) => {
          expect(err.status).toEqual(error.status);
          expect(err.statusText).toEqual(error.statusText);
          doneFn();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/comment/`);

      expect(req.request.method).toBe('POST');
      req.flush(errormsg, error);
    });
  });
});
