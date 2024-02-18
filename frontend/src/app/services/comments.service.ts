// angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// environment
import { environment } from '../environments/environment.api';
// models
import { ApiResponse } from '../models/api-respond.model';
import { Comment } from '../models/comments.model';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getComments(postId: number) {
    return this.http.get<ApiResponse<Comment>>(
      `${this.apiUrl}/comment/?post=${postId}`,
      {
        withCredentials: true,
      }
    );
  }

  getCommentPage(link: string) {
    return this.http.get<ApiResponse<Comment>>(link, {
      withCredentials: true,
    });
  }

  createComment(postId: number, comment: string) {
    return this.http.post(
      `${this.apiUrl}/comment/`,
      {
        post: postId,
        content: comment,
      },
      {
        withCredentials: true,
      }
    );
  }
}
