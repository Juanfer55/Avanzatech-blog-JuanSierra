// angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLinkWithHref } from '@angular/router';
// reactive forms
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
// services
import { PostService } from '../../services/postservice.service';
import { Post } from '../../models/post.model';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-update-post',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    RouterLinkWithHref,
  ],
  templateUrl: './update-post.component.html',
  styleUrl: './update-post.component.sass',
})
export class UpdatePostComponent {
  permissionOptions = [
    { value: 1, label: 'none' },
    { value: 2, label: 'read-only' },
    { value: 3, label: 'read-and-edit' },
  ];

  postId!: number;

  post: Post | null = null;

  requestStatus!: 'loading' | 'success' | 'error';

  updatePostForm!: FormGroup;

  backIcon = faCircleChevronLeft;

  constructor(
    private postService: PostService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.postId = params['id'];
    });
    this.getPost();
  }

  private buildForm(post: Post) {
    this.updatePostForm = this.formBuilder.group({
      title: [
        post.title,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
        ],
      ],
      content: [
        post.content,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(10000),
        ],
      ],
      public_permission: [
        this.findPermission(post.public_permission),
        [Validators.required],
      ],
      authenticated_permission: [
        this.findPermission(post.authenticated_permission),
        [Validators.required],
      ],
      team_permission: [
        this.findPermission(post.team_permission),
        [Validators.required],
      ],
      author_permission: [
        this.findPermission(post.author_permission),
        [Validators.required],
      ],
    });
  }

  getPost() {
    this.requestStatus = 'loading';
    this.postService.getPost(this.postId).subscribe({
      next: (response) => {
        this.post = response;
        this.buildForm(this.post);
        this.requestStatus = 'success';
      },
      error: (error) => {
        this.requestStatus = 'error';
        console.log(error);
      },
    });
  }

  findPermission(permission: string) {
    const permissionOption = this.permissionOptions.find(
      (option) => option.label === permission
    );
    if (permissionOption) {
      return permissionOption.value;
    }
    return 1;
  }

  updatePost() {
    if (this.updatePostForm.valid) {
      const post = this.updatePostForm.value;
      return this.postService.updatePost(this.postId, post).subscribe({
        next: () => {
          this.toastr.success('The post has been updated!', 'Success');
          this.router.navigate(['/post', this.postId]);
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
    this.updatePostForm.markAllAsTouched();
    return this.toastr.error('Fill out the form properly', 'Error');
  }
}
