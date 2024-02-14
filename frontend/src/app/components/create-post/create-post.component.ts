// angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// forms
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
// validators
import { Validators } from '@angular/forms';
// services
import { PostserviceService } from '../../services/postservice.service';
// toast
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.sass'
})
export class CreatePostComponent {

  formSubmitted = false;
  createPostForm!: FormGroup;

  permissionOptions = [
    { value: 1, label: 'None' },
    { value: 2, label: 'read-only' },
    { value: 3, label: 'read-and-edit' },
  ];

  constructor(
    private postService: PostserviceService,
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
