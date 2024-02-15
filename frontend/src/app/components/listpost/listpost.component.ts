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
// angular cdk dialog
import { Dialog } from '@angular/cdk/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';


@Component({
  selector: 'app-listpost',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './listpost.component.html',
  styleUrl: './listpost.component.sass',
})
export class ListpostComponent {
  @Input() post!: PostWithExcerpt;

  user: User | null = null;

  likes: Like[] = [];
  totalLikes: number = 0;

  like: Like | null = null;
  postIsLiked = false;

  commentCount!: number;

  editPermission = false;

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
    this.editPermission = this.hasEditPermission();
  }

  getLikes() {
    return this.likeService.getPostLikes(this.post.id).subscribe({
      next: (response) => {
        this.likes = response.results;
        this.totalLikes = response.total_count;
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
        this.totalLikes += 1;
      },
    });
  }

  unlikePost() {
    console.log(this.like!.id);
    return this.likeService.UnlikePost(this.like!.id).subscribe({
      next: () => {
        this.postIsLiked = false;
        this.like = null;
        this.totalLikes -= 1;
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
    if (
      this.user?.id === this.post.author.id &&
      this.post.author_permission === 'read-and-edit'
    ) {
      return true;
    } else if (
      this.user?.id !== this.post.author.id &&
      this.post.team_permission === 'read-and-edit' &&
      this.user?.team.id === this.post.author.team.id
    ) {
      return true;
    } else if (
      this.post.authenticated_permission === 'read-and-edit' &&
      this.user?.id !== this.post.author.id &&
      this.user?.team.id !== this.post.author.team.id
    ) {
      return true;
    } else if (
      this.user?.id === null &&
      this.post.public_permission === 'read-and-edit-and-delete'
    ) {
      return true;
    }
    return false;
  }

  detailView() {
    this.router.navigate(['/detailpost'], {
      queryParams: { postId: this.post.id },
    });
  }
}
