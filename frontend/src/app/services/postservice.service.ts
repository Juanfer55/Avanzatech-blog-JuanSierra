// angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// environment
import { environment } from '../environments/environment.api';
// models
import { Post, PostWithExcerpt, PostWithoutPermission } from '../models/post.model';
import { ApiResponse } from '../models/api-respond.model';
import { Subject, catchError, retry, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = environment.apiUrl;

  private postPage: number = 1;
  private totalPosts: number = 0;
  private resetPostStateSubject = new Subject<void>();

  constructor(
    private http: HttpClient
  ) {}

  getPosts(link?: string){
    const requestLink = link ? link : `${this.apiUrl}/post/?page=${this.postPage}`;

    return this.http.get<ApiResponse<PostWithExcerpt>>(requestLink, {
      withCredentials: true,
    }).pipe(
      retry(1),
      catchError((error) => {
        if (error.status === 404) {
          this.resetPostPage();
        }
        return throwError(() => error);
      }),
      tap((response) => {
        this.setServiceInfo(response);
      })
    );
  }

  getPost(id: number) {
    return this.http.get<Post>(`${this.apiUrl}/post/${id}/`, {
      withCredentials: true,
    });
  }

  createPost(post: Post) {
    return this.http.post<PostWithoutPermission>(`${this.apiUrl}/post/`, post, {
      withCredentials: true,
    });
  }

  deletePost(id: number) {
    return this.http.delete(`${this.apiUrl}/blog/${id}/`, {
      withCredentials: true,
    }).pipe(
      tap(() => {
        this.setPostPageAfterDelete();
      })
    );
  }

  updatePost(id: number, post: Post) {
    return this.http.put<PostWithoutPermission>(`${this.apiUrl}/blog/${id}/`, post, {
      withCredentials: true,
    });
  }

  setServiceInfo(response: ApiResponse<PostWithExcerpt>) {
    this.totalPosts = response.total_count;
    this.postPage = response.current_page;
  }

  resetPostPage() {
    this.postPage = 1;
    this.totalPosts = 0;
  }

  setPostPageAfterDelete() {
    const currentPage = this.postPage;
    const minPostsForCurrentPage = currentPage * 10 - 9;
    const totalCountAfterDelete = this.totalPosts - 1;

    if (currentPage > 1) {
      if (totalCountAfterDelete >= minPostsForCurrentPage) {
        return this.postPage = currentPage;
      }
      return this.postPage = currentPage - 1;
    }
    return
  }

  resetPostState() {
    this.resetPostPage();
    this.resetPostStateSubject.next();
  }

  onResetPostState() {
    return this.resetPostStateSubject.asObservable();
  }

  getPostPage() {
    return this.postPage;
  }

  getTotalPosts() {
    return this.totalPosts;
  }
}
