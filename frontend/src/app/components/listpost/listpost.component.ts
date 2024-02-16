// angular
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// models
import { PostWithExcerpt } from '../../models/post.model';
import { Like } from '../../models/like.model';
import { User } from '../../models/user.model';
// services
import { AuthService } from '../../services/auth.service';
import { LikesService } from '../../services/likes.service';
import { CommentsService } from '../../services/comments.service';
// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
// angular cdk dialog
import { Dialog } from '@angular/cdk/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
// angular cdk overlay
import { OverlayModule } from '@angular/cdk/overlay';
// components
import { LikesComponent } from '../likes/likes.component';
// icons



@Component({
  selector: 'app-listpost',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, OverlayModule, LikesComponent],
  templateUrl: './listpost.component.html',
  styleUrl: './listpost.component.sass',
})
export class ListpostComponent {
  @Input() post!: PostWithExcerpt;

  user: User | null = null;

  likes: Like[] = [];
  totalLikes: number = 0;
  likesIsOpen = false;
  likesTotalPages!: number;
  likesCurrentPage!: number;
  likesPreviousPage: string | null = null;
  likesNextPage: string | null = null;

  previousIcon = faAnglesLeft;
  nextIcon = faAnglesRight;

  like: Like | null = null;
  postIsLiked = false;

  commentCount!: number;

  solidHeartIcon = solidHeart;
  regularHeartIcon = regularHeart;
  commentIcon = faComment;
  editIcon = faPenToSquare;
  trashIcon = faTrashCan;

  constructor(
    private authService: AuthService,
    private likeService: LikesService,
    private commentService: CommentsService,
    private dialog: Dialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.userProfile$.subscribe((userProfile) => {
      if (userProfile) {
        this.user = userProfile;
      }
    });
    this.getLikes();
    this.getComments();
    if (this.user) {
      this.getUserLike();
    }
  }

  getLikes() {
    return this.likeService.getPostLikes(this.post.id).subscribe({
      next: (response) => {
        this.likes = response.results;
        this.totalLikes = response.total_count;
        this.likesTotalPages = response.total_pages;
        this.likesCurrentPage = response.current_page;
        this.likesPreviousPage = response.previous;
        this.likesNextPage = response.next;
      },
    });
  }

  getComments() {
    return this.commentService.getComments(this.post.id).subscribe({
      next: (response) => {
        this.commentCount = response.total_count;
      },
    });
  }

  getUserLike() {
    return this.likeService
      .getUserLike(this.user?.id!, this.post.id)
      .subscribe({
        next: (response) => {
          if (response.total_count === 1) {
            this.like = response.results[0];
            this.postIsLiked = true;
          }
        },
      });
  }

  likePost() {
    return this.likeService.likePost(this.post.id).subscribe({
      next: (response) => {
        this.like = response;
        this.postIsLiked = true;
        this.getLikes();
      },
    });
  }

  unlikePost() {
    return this.likeService.UnlikePost(this.like!.id).subscribe({
      next: () => {
        this.postIsLiked = false;
        this.like = null;
        this.getLikes();
      },
    });
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        postId: this.post.id,
        postTitle: this.post.title,
      },
    });
  }

  hasEditPermission() {
    if (!this.user) {
      return this.post.public_permission === 'read-and-edit';
    }

    if (this.user.id === this.post.author.id) {
      return this.post.author_permission === 'read-and-edit';
    }

    if (
      this.post.team_permission === 'read-and-edit' &&
      this.user.team.id === this.post.author.team.id
    ) {
      return true;
    }

    return (
      this.post.authenticated_permission === 'read-and-edit' &&
      this.user.team.id !== this.post.author.team.id &&
      this.user.id !== this.post.author.id
    );
  }

  detailView() {
    this.router.navigate(['/post', this.post.id]);
  }
}
