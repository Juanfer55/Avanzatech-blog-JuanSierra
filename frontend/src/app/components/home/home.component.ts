// angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// services
import { PostserviceService } from '../../services/postservice.service';
import { PostWithExcerpt } from '../../models/post.model';
// components
import { ListpostComponent } from '../listpost/listpost.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ListpostComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
})
export class HomeComponent {
  previousPage: string | null = null;
  nextPage: string | null = null;
  posts: PostWithExcerpt[] = [];
  totalPost: number = 0

  constructor(
    private postService: PostserviceService
    ) {}

  ngOnInit() {
    this.getPosts();
  }

  getPosts() {
    this.postService.getPosts().subscribe({
      next: (response) => {
        this.posts = response.results;
        this.previousPage = response.previous;
        this.nextPage = response.next;
      },
    });
  }

  getNextPage() {
    if (this.nextPage) {
      this.postService.getPosts(this.nextPage).subscribe({
        next: (response) => {
          this.posts = response.results;
          this.previousPage = response.previous;
          this.nextPage = response.next;
        },
      });
    }
  }

  getPreviousPage() {
    if (this.previousPage) {
      this.postService.getPosts(this.previousPage).subscribe({
        next: (response) => {
          this.posts = response.results;
          this.previousPage = response.previous;
          this.nextPage = response.next;
        },
      });
    }
  }
}
