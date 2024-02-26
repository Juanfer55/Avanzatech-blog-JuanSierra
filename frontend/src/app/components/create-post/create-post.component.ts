// angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLinkWithHref } from '@angular/router';
// forms
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
// validators
import { Validators } from '@angular/forms';
// services
import { PostService } from '../../services/postservice.service';
// toast
import { ToastrService } from 'ngx-toastr';
// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { CustomValidators } from '../../shared/customValidators/customValidators';
// constants
import { permissionOptions, readAndEditPermission, readOnlyPermission } from '../../shared/utilities/constants';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterLinkWithHref,
  ],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.sass',
})
export class CreatePostComponent {

  options = permissionOptions;

  createPostForm!: FormGroup;

  backIcon = faCircleChevronLeft;

  constructor(
    private router: Router,
    private postService: PostService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    this.buildForm();
  }

  private buildForm() {
    this.createPostForm = this.formBuilder.group({
      title: [
        '',
        [
          Validators.required,
          CustomValidators.fieldIsNotEmpty,
          Validators.minLength(1),
          Validators.maxLength(50),
        ],
      ],
      content: [
        '',
        [
          Validators.required,
          CustomValidators.fieldIsNotEmpty,
          Validators.minLength(1),
          Validators.maxLength(10000),
        ],
      ],
      public_permission: [readOnlyPermission, [Validators.required]],
      authenticated_permission: [readOnlyPermission, [Validators.required]],
      team_permission: [readAndEditPermission, [Validators.required]],
      author_permission: [readAndEditPermission, [Validators.required]],
    });
  }

  private handleErrors(err: any) {
    if (err.status === 0 || err.status === 500) {
      this.router.navigate(['/server-error']);
    }
  }

  createPost() {
    if (this.createPostForm.valid) {
      return this.postService.createPost(this.createPostForm.value).subscribe({
        next: () => {
          this.toastr.success('The post has been created!', 'Success');
          this.postService.resetPostPage();
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.handleErrors(err);
        },
      });
    }
    this.createPostForm.markAllAsTouched();
    return this.toastr.error('Fill out the form properly', 'Error', {
      positionClass: 'toast-top-full-width',
    });
  }
}
