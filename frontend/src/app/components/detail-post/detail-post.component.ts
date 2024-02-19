// angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../models/post.model';
import { RouterLinkWithHref } from '@angular/router';
// reactive forms
import {
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
// services
import { PostService } from '../../services/postservice.service';
import { LikesService } from '../../services/likes.service';
import { CommentsService } from '../../services/comments.service';
import { ToastrService } from 'ngx-toastr';
// model
import { User } from '../../models/user.model';
import { Comment } from '../../models/comments.model';
// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-detail-post',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterLinkWithHref,
    ReactiveFormsModule,
  ],
  templateUrl: './detail-post.component.html',
  styleUrl: './detail-post.component.sass',
})
export class DetailPostComponent {
  user: User | null = null;

  postId!: number;
  post: Post | null = null;

  likeCount!: number;

  comments: Comment[] = [];
  commentCount!: number;
  commentsTotalPages!: number;
  commentsCurrentPage!: number;
  commentsPreviousPage: string | null = null;
  commentsNextPage: string | null = null;

  backIcon = faCircleChevronLeft;
  previousIcon = faAnglesLeft;
  nextIcon = faAnglesRight;

  commentForm!: FormGroup;

  commentFormSubmitted = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastrService,
    private route: ActivatedRoute,
    private postService: PostService,
    private likeService: LikesService,
    private commentService: CommentsService,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.authService.userProfile$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
    this.route.paramMap.subscribe(params => {
      this.postId = Number(params.get('id'));
    });
    this.getPost();
    this.getLikes();
    this.getComments();
  }

  buildForm() {
    this.commentForm = this.formBuilder.group({
      comment: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1000),
        ],
      ],
    });
  }

  getPost() {
    this.postService.getPost(this.postId).subscribe({
      next: (response) => {
        this.post = response;
      },
    });
  }

  getLikes() {
    this.likeService.getPostLikes(this.postId).subscribe({
      next: (response) => {
        this.likeCount = response.total_count;
      },
    });
  }

  getComments(link?: string) {
    const comments = link
      ? this.commentService.getCommentPage(link)
      : this.commentService.getComments(this.postId);

    return comments.subscribe({
      next: (response) => {
        this.comments = response.results;
        this.commentCount = response.total_count;
        this.commentsTotalPages = response.total_pages;
        this.commentsCurrentPage = response.current_page;
        this.commentsPreviousPage = response.previous;
        this.commentsNextPage = response.next;
      },
    });
  }

  addComment() {
    this.commentFormSubmitted = true;
    if (this.commentForm.valid) {
      const content = this.commentForm.get('comment')?.value;
      return this.commentService.createComment(this.postId, content).subscribe({
        next: () => {
          this.getComments();
          this.cleanForm();
          this.commentFormSubmitted = false;
        },
      });
    }
    return this.toastService.error('Please, fill in the form correctly', 'Error', {
      positionClass: 'toast-top-full-width',
    });
  }

  cleanForm() {
    this.commentForm.controls['comment'].reset();
  }
}
