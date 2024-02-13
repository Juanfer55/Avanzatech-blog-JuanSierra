// angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// environment
import { environment } from '../environments/environment.api';
// models
import { ApiResponse } from '../models/api-respond.model';
import { Like } from '../models/like.model';
// cookie service
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
    ) {}

  getPostLikes(postId: Number) {
    return this.http.get<ApiResponse<Like>>(
      `${this.apiUrl}/like/?post=${postId}`,
      {
        withCredentials: true,
      }
    );
  }

  getUserLike(userId: Number, postId: Number) {
    return this.http.get<ApiResponse<Like>>(
      `${this.apiUrl}/like/?user=${userId}&post=${postId}`,
      {
        withCredentials: true,
      }
    );
  }

  likePost(postId: Number) {
    const csrftoken = this.cookieService.get('csrftoken');
    console.log(csrftoken);

    const headers = new HttpHeaders({
      'content-type': 'application/json',
      'X-CSRFToken': 'fn1gbxaIKtkmS2ObBb7AWBPfGm3UswFy',
    })

    return this.http.post<Like>(
      `${this.apiUrl}/like/`,
      { post: postId },
      { headers: headers, withCredentials: true }
    );
  }

  UnlikePost(likeId: Number) {
    return this.http.delete(`${this.apiUrl}/like/${likeId}`,{
      withCredentials: true
    })
  }
}
