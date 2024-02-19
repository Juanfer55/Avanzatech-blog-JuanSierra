// angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// services
import { PostService } from '../../services/postservice.service';
import { AuthService } from '../../services/auth.service';
// models
import { PostWithExcerpt } from '../../models/post.model';
// components
import { ListpostComponent } from '../listpost/listpost.component';
// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
// href
import { RouterLinkWithHref } from '@angular/router';
import { UserProfile } from '../../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ListpostComponent,
    FontAwesomeModule,
    RouterLinkWithHref,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
})
export class HomeComponent {
  logStatus$: Observable<boolean> = this.authService.logStatus$;

  previousPage: string | null = null;
  nextPage: string | null = null;
  currentPage!: number;
  totalPages!: number;
  posts: PostWithExcerpt[] = [];

  requestStatus: 'loading' | 'error' | 'success' = 'loading';

  CreatePostIcon = faCirclePlus;
  previousPageIcon = faAnglesLeft;
  nextPageIcon = faAnglesRight;

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getPosts();
  }

  getPosts(link?: string) {
    this.requestStatus = 'loading'
    const posts = link
      ? this.postService.getPosts(link)
      : this.postService.getPosts();

    return posts.subscribe({
      next: (response) => {
        this.posts = response.results;
        this.previousPage = response.previous;
        this.nextPage = response.next;
        this.currentPage = response.current_page;
        this.totalPages = response.total_pages;
        this.requestStatus = 'success';
        window.scrollTo(0, 0);
      },
      error: () => {
        this.requestStatus = 'error';
      },
    });
  }
}
