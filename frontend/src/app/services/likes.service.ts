// angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// environment
import { environment } from '../environments/environment.api';
// models
import { ApiResponse } from '../models/api-respond.model';
import { Like } from '../models/like.model';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    ) {}

  getPostLikes(postId: number) {
    return this.http.get<ApiResponse<Like>>(
      `${this.apiUrl}/like/?post=${postId}`,
      {
        withCredentials: true,
      }
    );
  }

  getUserLike(userId: number, postId: number) {
    return this.http.get<ApiResponse<Like>>(
      `${this.apiUrl}/like/?user=${userId}&post=${postId}`,
      {
        withCredentials: true,
      }
    );
  }

  getLikePage(link: string) {
    return this.http.get<ApiResponse<Like>>(link, {
      withCredentials: true,
    });
  }

  likePost(postId: number) {
    return this.http.post<Like>(
      `${this.apiUrl}/like/`,
      { post: postId },
      { withCredentials: true }
    );
  }

  UnlikePost(likeId: number) {
    return this.http.delete(`${this.apiUrl}/like/${likeId}`,{
      withCredentials: true
    })
  }

}
