import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiResponse } from '../../models/api-respond.model';
import { Like } from '../../models/like.model';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-list-likes',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './list-likes.component.html',
  styleUrl: './list-likes.component.sass'
})
export class ListLikesComponent {

  @Input() likesResponse: ApiResponse<Like> | null = null;
  @Output() pageChange = new EventEmitter<string>();

  likes: Like[] = [];
  totalLikes: number = 0;
  likesIsOpen = false;
  likesTotalPages!: number;
  likesCurrentPage!: number;
  likesPreviousPage: string | null = null;
  likesNextPage: string | null = null;

  previousIcon = faAnglesLeft;
  nextIcon = faAnglesRight;

  constructor() {
  }

  ngOnInit() {
    this.likes = this.likesResponse?.results || [];
    this.totalLikes = this.likesResponse?.total_count || 0;
    this.likesTotalPages = this.likesResponse?.total_pages || 0;
    this.likesCurrentPage = this.likesResponse?.current_page || 0;
    this.likesPreviousPage = this.likesResponse?.previous || null;
    this.likesNextPage = this.likesResponse?.next || null;
  }

  likePageChange(page: string) {
    this.pageChange.emit(page);
  }
}
