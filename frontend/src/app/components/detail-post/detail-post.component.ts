// angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../models/post.model';
import { RouterLinkWithHref } from '@angular/router';
// reactive forms
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
// services
import { PostService } from '../../services/postservice.service';
import { LikesService } from '../../services/likes.service';
import { CommentsService } from '../../services/comments.service';
// model
import { User } from '../../models/user.model';
import { Comment } from '../../models/comments.model';
// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';

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

  commentForm!: FormGroup;

  constructor(
    private authService: AuthService,
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
    this.postId = this.route.snapshot.params['id'];
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
        console.log(this.post);
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

  getComments() {
    this.commentService.getComments(this.postId).subscribe({
      next: (response) => {
        console.log(response);
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
    const content = this.commentForm.get('comment')?.value;
    console.log(content);
    if (this.commentForm.invalid) {
      return this.commentService.createComment(this.postId, content).subscribe({
        next: () => {
          this.getComments();
        },
      });
    }
    return;
  }

  cleanForm() {
    console.log('clean form');
    this.commentForm.controls['comment'].setValue('');
  }
}
