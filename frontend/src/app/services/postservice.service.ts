// angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// environment
import { environment } from '../environments/environment.api';
// models
import { PostWithExcerpt } from '../models/post.model';
import { ApiResponse } from '../models/api-respond.model';

@Injectable({
  providedIn: 'root',
})
export class PostserviceService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
    ) {}

  getPosts(link?: string){

    if (link) {
      return this.http.get<ApiResponse<PostWithExcerpt>>(link, {
        withCredentials: true
      })
    }
    return this.http.get<ApiResponse<PostWithExcerpt>>(`${this.apiUrl}/post/`, {
      withCredentials: true,
    });
  }

  getPost(id: number) {
    return this.http.get(`${this.apiUrl}/post/${id}/`, {
      withCredentials: true,
    });
  }
}
