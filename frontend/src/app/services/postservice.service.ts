// angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// environment
import { environment } from '../environments/environment.api';
// models
import { Post, PostWithExcerpt, PostWithoutPermission } from '../models/post.model';
import { ApiResponse } from '../models/api-respond.model';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  getPosts(link?: string){
    const requestLink = link ? link : `${this.apiUrl}/post/`;

    return this.http.get<ApiResponse<PostWithExcerpt>>(requestLink, {
      withCredentials: true,
    });
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
    })
  }

  updatePost(id: number, post: Post) {
    return this.http.put<PostWithoutPermission>(`${this.apiUrl}/blog/${id}/`, post, {
      withCredentials: true,
    });
  }
}
