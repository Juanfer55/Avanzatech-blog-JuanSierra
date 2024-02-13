// angular
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// services
import { LikesService } from '../../services/likes.service';
// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { Like } from '../../models/like.model';
import { HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-like-post',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './like-post.component.html',
  styleUrl: './like-post.component.sass',
})
export class LikePostComponent {

  like: Like | null = null;
  postIsLiked = false;

  solidHeartIcon = solidHeart;
  regularHeartIcon = regularHeart;

  @Input() postId!: Number;
  @Input() userId!: Number;

  constructor(
    private likeService: LikesService,
    private router: Router
    ) {}

  ngOnInit() {
    this.getUserLike();
  }

  getUserLike() {
    return this.likeService.getUserLike(this.userId!, this.postId).subscribe({
      next: (response) => {
        if (response.total_count === 1) {
          this.postIsLiked = true;
        }
      },
    });
  }

  LikePost() {

    return this.likeService.likePost(this.postId).subscribe({
      next: (response) => {
        this.like = response;
        this.postIsLiked = true;
      },
    });
  }

  UnlikePost() {
    return this.likeService.UnlikePost(this.like!.id).subscribe({
      next: () => {
        this.postIsLiked = false;
        this.like = null;
      }
    });
  }
}
