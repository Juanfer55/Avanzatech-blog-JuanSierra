// angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
// components
import { PostNotFoundComponent } from '../../shared/components/post-not-found/post-not-found.component';
import { ListCommentsComponent } from '../list-comments/list-comments.component';
// model
import { UserProfile } from '../../models/user.model';
import { Comment } from '../../models/comments.model';
// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { ApiResponse } from '../../models/api-respond.model';
// custom validators
import { CustomValidators } from '../customValidators/customValidators';


@Component({
  selector: 'app-detail-post',
  standalone: true,
  imports: [
    CommonModule,
    PostNotFoundComponent,
    FontAwesomeModule,
    RouterLinkWithHref,
    ReactiveFormsModule,
    ListCommentsComponent,
  ],
  templateUrl: './detail-post.component.html',
  styleUrl: './detail-post.component.sass',
})
export class DetailPostComponent {
  user: UserProfile | null = null;

  postId!: number;
  post: Post | null = null;

  requestStatus!: 'loading' | 'success' | 'error';

  likeCount!: number;

  commentsResponse!: ApiResponse<Comment>;

  backIcon = faCircleChevronLeft;

  commentForm!: FormGroup;

  commentFormSubmitted = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastrService,
    private route: ActivatedRoute,
    private postService: PostService,
    private likeService: LikesService,
    private commentService: CommentsService,
    private formBuilder: FormBuilder,
    private router: Router
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

  private handleErrors(err: any) {
    if (err.status === 0 || err.status === 500) {
      this.router.navigate(['/server-error']);
    }
  }

  buildForm() {
    this.commentForm = this.formBuilder.group({
      comment: [
        '',
        [
          Validators.required,
          CustomValidators.fieldIsNotEmpty,
          Validators.minLength(1),
          Validators.maxLength(1000),
        ],
      ],
    });
  }

  getPost() {
    this.requestStatus = 'loading';
    this.postService.getPost(this.postId).subscribe({
      next: (response) => {
        this.post = response;
        this.requestStatus = 'success';
      },
      error: (response) => {
          this.requestStatus = 'error';
          this.handleErrors(response);
      }
    });
  }

  getLikes() {
    this.likeService.getPostLikes(this.postId).subscribe({
      next: (response) => {
        this.likeCount = response.total_count;
      },
      error: (err) => {
        this.handleErrors(err);
      },
    });
  }

  getComments(link?: string) {
    const comments = link
      ? this.commentService.getCommentPage(link)
      : this.commentService.getComments(this.postId);

    return comments.subscribe({
      next: (response) => {
        this.commentsResponse = response;
      },
      error: (err) => {
        this.handleErrors(err);
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
        },
        error: (err) => {
          this.handleErrors(err);
        },
      });
    }
    return this.toastService.error('Please, fill in the form correctly', 'Error', {
      positionClass: 'toast-top-full-width',
    });
  }

  cleanForm() {
    this.commentForm.controls['comment'].reset();
    this.commentFormSubmitted = false;
  }
}
