// angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// environment
import { environment } from '../environments/environment.api';
// models
import { ApiResponse } from '../models/api-respond.model';
import { Comment } from '../models/comments.model';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  apiUrl = environment.apiUrl

  constructor(
    private http: HttpClient
  ) {}

  getComments(postId: Number) {
    return this.http.get<ApiResponse<Comment>>(`${this.apiUrl}/comment/?post=${postId}`,{
      withCredentials: true
    })
  }
}
