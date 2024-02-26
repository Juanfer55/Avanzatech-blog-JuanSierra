  // angular
  import { Component } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { Router, RouterLinkWithHref } from '@angular/router';
  // services
  import { PostService } from '../../services/postservice.service';
  import { AuthService } from '../../services/auth.service';
  import { ToastrService } from 'ngx-toastr';
  // models
  import { PostWithExcerpt } from '../../models/post.model';
  // components
  import { ListpostComponent } from '../list-post/listpost.component';
  // icons
  import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
  import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
  import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
  import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
  // rxjs
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
    currentPage: number | null = null;
    totalPages: number | null = null;
    totalPosts: number | null = null;
    posts: PostWithExcerpt[] | null = null;

    postsLoaded: boolean = false;

    CreatePostIcon = faCirclePlus;
    previousPageIcon = faAnglesLeft;
    nextPageIcon = faAnglesRight;

    constructor(
      private postService: PostService,
      private authService: AuthService,
      private router: Router,
      private toast: ToastrService
    ) {}

    ngOnInit() {
      this.postService.onResetPostState().subscribe(() => {
        this.getPosts();
      });
      this.getPosts();
    }

    private handleErrors(err: any) {
      if (err.status === 0 || err.status === 500) {
        this.router.navigate(['/server-error']);
      }
    }

    getPosts(link?: string) {
      return this.postService.getPosts(link).subscribe({
        next: (response) => {
          this.posts = response.results;
          this.previousPage = response.previous;
          this.nextPage = response.next;
          this.currentPage = response.current_page;
          this.totalPages = response.total_pages;
          this.totalPosts = response.total_count;
          this.postsLoaded = true;
          window.scrollTo(0, 0);
        },
        error: (err) => {
          this.handleErrors(err);
        },
      });
    }

    deletePost(postId: number) {
      return this.postService.deletePost(postId).subscribe({
        next: () => {
          this.toast.success('The Post was deleted successfully!');
          this.getPosts();
        },
        error: (err) => {
          this.toast.error('Something went wrong!');
          this.handleErrors(err);
        },
      });
    }
  }
