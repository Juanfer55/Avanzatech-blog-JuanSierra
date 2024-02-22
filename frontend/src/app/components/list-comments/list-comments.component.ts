// angular
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// models
import { ApiResponse } from '../../models/api-respond.model';
import { Comment } from '../../models/comments.model';
import { faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-list-comments',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './list-comments.component.html',
  styleUrl: './list-comments.component.sass',
})
export class ListCommentsComponent {

  @Input() commentsResponse: ApiResponse<Comment> | null = null;
  @Output() pageChange = new EventEmitter<string>();

  comments!: Comment[];
  commentCount!: number;
  commentsTotalPages!: number;
  commentsCurrentPage!: number;
  commentsPreviousPage: string | null = null;
  commentsNextPage: string | null = null;

  previousIcon = faAnglesLeft;
  nextIcon = faAnglesRight;

  constructor() {}

  ngOnChanges() {
    this.comments = this.commentsResponse?.results || [];
    this.commentCount = this.commentsResponse?.total_count || 0;
    this.commentsTotalPages = this.commentsResponse?.total_pages || 0;
    this.commentsCurrentPage = this.commentsResponse?.current_page || 0;
    this.commentsPreviousPage = this.commentsResponse?.previous || null;
    this.commentsNextPage = this.commentsResponse?.next || null;
  }

  commentPageChange(page: string) {
    this.pageChange.emit(page);
  }
}
