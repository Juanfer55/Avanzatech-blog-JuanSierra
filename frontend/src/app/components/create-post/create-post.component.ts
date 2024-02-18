// angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
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

  formSubmitted = false;
  createPostForm!: FormGroup;

  backIcon = faCircleChevronLeft;

  constructor(
    private postService: PostService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    this.buildForm();
  }

  private buildForm() {
    this.createPostForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      content: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1000)]],
      public: [2, [Validators.required]],
      authenticated: [2, [Validators.required]],
      team: [3, [Validators.required]],
      author: [3, [Validators.required]]
    });
  }

  createPost() {
    this.formSubmitted = true;
    if (this.createPostForm.invalid) {

      return this.postService.createPost(this.createPostForm.value).subscribe({
        next: (response) => {
          this.toastr.success('The post has been created!');
          console.log(response);
        },
        error: (error) => {
          this.toastr.error('Something went wrong!');
          console.log(error);
        }
      })
    }
    return this.toastr.error('The post has not been created!');
  }
}
