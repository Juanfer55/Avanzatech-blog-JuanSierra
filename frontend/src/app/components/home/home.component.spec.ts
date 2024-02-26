import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/postservice.service';
import { ApiResponseMock } from '../../testing/mocks/apiResponse.mocks';
import { PostListMock } from '../../testing/mocks/post.mocks';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LikesService } from '../../services/likes.service';
import { CommentsService } from '../../services/comments.service';
import { LikeMock } from '../../testing/mocks/like.mocks';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';

@Component({
  selector: 'app-StubComponent',
  template: '<h1>stub component</h1>',
})
class StubComponent {}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let postService: jasmine.SpyObj<PostService>;
  let likesService: jasmine.SpyObj<LikesService>;
  let toastService: jasmine.SpyObj<ToastrService>;
  let commentsService: jasmine.SpyObj<CommentsService>;
  let router: jasmine.SpyObj<Router>;
  const postResponse = ApiResponseMock(PostListMock(20), 20, 2, 2);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        RouterTestingModule.withRoutes([
          { path: 'server-error', component: StubComponent },
        ]),
        CommonModule,
        FontAwesomeModule,
      ],
      providers: [
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj('AuthService', [
            'logStatus$',
            'userProfile$',
          ]),
        },
        {
          provide: PostService,
          useValue: jasmine.createSpyObj('PostService', [
            'getPosts',
            'deletePost',
            'onResetPostState',
          ]),
        },
        {
          provide: LikesService,
          useValue: jasmine.createSpyObj('LikesService', [
            'getLikes',
            'getPostLikes',
          ]),
        },
        {
          provide: CommentsService,
          useValue: jasmine.createSpyObj('CommentService', ['getComments']),
        },
        {
          provide: ToastrService,
          useValue: jasmine.createSpyObj('ToastrService', ['error', 'success']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    likesService = TestBed.inject(LikesService) as jasmine.SpyObj<LikesService>;
    toastService = TestBed.inject(
      ToastrService
    ) as jasmine.SpyObj<ToastrService>;
    commentsService = TestBed.inject(
      CommentsService
    ) as jasmine.SpyObj<CommentsService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    postService.onResetPostState.and.returnValue(of());
    component.logStatus$ = of(false);
    postService.getPosts.and.returnValue(of(postResponse));
    likesService.getPostLikes.and.returnValue(
      of(ApiResponseMock([LikeMock()]))
    );
    commentsService.getComments.and.returnValue(of(ApiResponseMock([])));
    authService.logStatus$ = of(false);
    authService.userProfile$ = of(null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('getPosts() tests', () => {
    it('should set the posts', () => {
      expect(component.posts).toEqual(postResponse.results);
    });
    it('should set the next page', () => {
      expect(component.nextPage).toBe(postResponse.next);
    });
    it('should set the previous page', () => {
      expect(component.previousPage).toBe(postResponse.previous);
    });
    it('should set the current page', () => {
      expect(component.currentPage).toBe(postResponse.current_page);
    });
    it('should set the total pages', () => {
      expect(component.totalPages).toBe(postResponse.total_pages);
    });
    it('it should send the input to the list post component', () => {
      const listPostComponent = fixture.debugElement.query(
        By.css('app-listpost')
      );
      expect(listPostComponent).toBeTruthy();
    });
    it('should call the getPost method with the link', () => {
      component.getPosts('link');
      expect(postService.getPosts).toHaveBeenCalledWith('link');
    });
    it('should navigate to the server error component if there was a server error', () => {
      spyOn(router, 'navigate');
      postService.getPosts.and.returnValue(throwError(() => {
        const error = new Error('Server Error');
        (error as any).status = 500;
        return error;
      }));
      component.getPosts();
      expect(router.navigate).toHaveBeenCalledWith(['/server-error']);
    });
  });
  describe('deletePost() tests', () => {
    it('should call the deletePost method', () => {
      postService.deletePost.and.returnValue(of({}));
      component.deletePost(1);
      expect(postService.deletePost).toHaveBeenCalledWith(1);
    });
    it('should call the getPosts method', () => {
      postService.deletePost.and.returnValue(of({}));
      postService.getPosts.and.returnValue(of(postResponse));
      component.deletePost(1);
      expect(postService.getPosts).toHaveBeenCalled();
    });
    it('should call the toastr success method', () => {
      postService.deletePost.and.returnValue(of({}));
      component.deletePost(1);
      expect(toastService.success).toHaveBeenCalled();
    });
    it('should call the toastr error method', () => {
      postService.deletePost.and.returnValue(throwError(() => {
        const error = new Error('Server Error');
        (error as any).status = 500;
        return error;
      }));
      component.deletePost(1);
      expect(toastService.error).toHaveBeenCalled();
    });
  });
  describe('onResetPostState()suubscription test', () => {
    it('should call the getPosts method if the onResetPostState change state', () => {
      postService.onResetPostState.and.callFake(() => {
        return of();
      });
      postService.getPosts.and.returnValue(of(postResponse));
      postService.onResetPostState().subscribe(() => {
        expect(postService.getPosts).toHaveBeenCalled();
      });
    });
  });
  describe('render tests', () => {
    it('should render the list post component', () => {
      const listPostComponent = fixture.debugElement.query(
        By.css('app-listpost')
      );
      expect(listPostComponent).toBeTruthy();
    });
    it('should render the previous page button', () => {
      const previousPageButton = fixture.debugElement.query(
        By.css('[data-testid="previous-page-button"]')
      );
      expect(previousPageButton).toBeTruthy();
    });
    it('should render the next page button', () => {
      const nextPageButton = fixture.debugElement.query(
        By.css('[data-testid="next-page-button"]')
      );
      expect(nextPageButton).toBeTruthy();
    });
    it('should not render the create post button if the user is not login', () => {
      const createPostButton = fixture.debugElement.query(
        By.css('[data-testid="create-post-button"]')
      );
      expect(createPostButton).toBeFalsy();
    });
    it('should render the create post button if the user is login', fakeAsync(() => {
      component.logStatus$ = of(true);
      fixture.detectChanges();
      tick();
      const createPostButton = fixture.debugElement.query(
        By.css('[data-testid="create-post-button"]')
      );
      expect(createPostButton).toBeTruthy();
    }));
  });
});
