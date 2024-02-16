// angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// services
import { PostserviceService } from '../../services/postservice.service';
import { AuthService } from '../../services/auth.service';
// models
import { PostWithExcerpt } from '../../models/post.model';
// components
import { ListpostComponent } from '../listpost/listpost.component';
// icon
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
// href
import { RouterLinkWithHref } from '@angular/router';
import { UserProfile } from '../../models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ListpostComponent, FontAwesomeModule, RouterLinkWithHref],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
})
export class HomeComponent {
  userProfile: UserProfile | null = null;

  previousPage: string | null = null;
  nextPage: string | null = null;
  currentPage!: number;
  totalPages!: number;
  posts: PostWithExcerpt[] = [];
  totalPost: number = 0

  CreatePostIcon = faCirclePlus;
  previousPageIcon = faAnglesLeft;
  nextPageIcon = faAnglesRight;

  constructor(
    private postService: PostserviceService,
    private authService: AuthService,
    ) {}

  ngOnInit() {
    this.authService.userProfile$.subscribe((userProfile) => {
      if (userProfile) {
        this.userProfile = userProfile;
      }
    })
    this.getPosts();
  }

  getPosts() {
    this.postService.getPosts().subscribe({
      next: (response) => {
        this.posts = response.results;
        this.previousPage = response.previous;
        this.nextPage = response.next;
        this.currentPage = response.current_page;
        this.totalPages = response.total_pages;
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
          this.currentPage = response.current_page;
          window.scrollTo(0, 0);
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
          this.currentPage = response.current_page;
          window.scrollTo(0, 0);
        },
      });
    }
  }
}
