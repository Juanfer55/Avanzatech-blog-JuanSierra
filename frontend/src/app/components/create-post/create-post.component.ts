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
import { faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons'


@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, RouterLinkWithHref],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.sass'
})
export class CreatePostComponent {

  permissionOptions = [
    { value: 1, label: 'None' },
    { value: 2, label: 'read-only' },
    { value: 3, label: 'read-and-edit' },
  ];

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
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      content: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10000)]],
      public_permission: [2, [Validators.required]],
      authenticated_permission: [2, [Validators.required]],
      team_permission: [3, [Validators.required]],
      author_permission: [3, [Validators.required]]
    });
  }

  createPost() {
    if (this.createPostForm.valid) {

      return this.postService.createPost(this.createPostForm.value).subscribe({
        next: (response) => {
          this.toastr.success('The post has been created!', 'Success');
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.toastr.error('Something went wrong!', 'Error', {
            positionClass: 'toast-top-full-width',
          });;
          console.log(error);
        }
      })
    }
    this.createPostForm.markAllAsTouched();
    return this.toastr.error('Fill out the form properly', 'Error');
  }

}
