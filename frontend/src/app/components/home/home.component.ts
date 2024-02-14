// angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// services
import { PostserviceService } from '../../services/postservice.service';
import { PostWithExcerpt } from '../../models/post.model';
// components
import { ListpostComponent } from '../listpost/listpost.component';
// icon
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
// href
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ListpostComponent, FontAwesomeModule, RouterLinkWithHref],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
})
export class HomeComponent {
  previousPage: string | null = null;
  nextPage: string | null = null;
  posts: PostWithExcerpt[] = [];
  totalPost: number = 0

  CreatePostIcon = faCirclePlus;

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
