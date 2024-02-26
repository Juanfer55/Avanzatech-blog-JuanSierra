import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailPostComponent } from './detail-post.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../services/postservice.service';
import { LikesService } from '../../services/likes.service';
import { CommentsService } from '../../services/comments.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PostMock } from '../../testing/mocks/post.mocks';
import { ApiResponseMock } from '../../testing/mocks/apiResponse.mocks';
import { LikeMock } from '../../testing/mocks/like.mocks';
import { CommentMock } from '../../testing/mocks/comment.mocks';
import { AuthService } from '../../services/auth.service';
import { UserProfileMock } from '../../testing/mocks/user.mocks';

describe('DetailPostComponent', () => {
  let component: DetailPostComponent;
  let fixture: ComponentFixture<DetailPostComponent>;
  let postService: jasmine.SpyObj<PostService>;
  let LikeService: jasmine.SpyObj<LikesService>;
  let commentsService: jasmine.SpyObj<CommentsService>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let route: jasmine.SpyObj<ActivatedRoute>;
  let router: jasmine.SpyObj<Router>;
  let authService: jasmine.SpyObj<AuthService>;
  const userProfile = UserProfileMock();
  const postMock = PostMock();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPostComponent, RouterTestingModule, FontAwesomeModule, ReactiveFormsModule],
      providers: [
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj('AuthService', ['userProfile$']),
        },
        {
          provide: PostService,
          useValue: jasmine.createSpyObj('PostService', ['getPost']),
        },
        {
          provide: LikesService,
          useValue: jasmine.createSpyObj('LikesService', ['getPostLikes']),
        },
        {
          provide: CommentsService,
          useValue: jasmine.createSpyObj('CommentsService', ['getComments', 'getCommentPage', 'createComment']),
        },
        {
          provide: ToastrService,
          useValue: jasmine.createSpyObj('ToastrService', ['success', 'error']),
        },

      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPostComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    LikeService = TestBed.inject(LikesService) as jasmine.SpyObj<LikesService>;
    commentsService = TestBed.inject(CommentsService) as jasmine.SpyObj<CommentsService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    route = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    authService.userProfile$ = of(userProfile);
    component.user = userProfile
    postService.getPost.and.returnValue(of(postMock));
    LikeService.getPostLikes.and.returnValue(of(ApiResponseMock([LikeMock()])));
    commentsService.getComments.and.returnValue(of(ApiResponseMock([CommentMock()])));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit() tests', () => {
    it('should set user', () => {
      expect(component.user).toEqual(userProfile);
    });
    it('should set postId', () => {
      component.postId = 1;
      expect(component.postId).toEqual(1);
    });
    it('should call getPost', () => {
      expect(postService.getPost).toHaveBeenCalled();
    });
    it('should call getLikes', () => {
      expect(LikeService.getPostLikes).toHaveBeenCalled();
    });
    it('should call getComments', () => {
      expect(commentsService.getComments).toHaveBeenCalled();
    });
  });
  describe('getPost() tests', () => {
    it('should set post', () => {
      expect(component.post).toEqual(postMock);
    });
    it('should set requestStatus', () => {
      expect(component.requestStatus).toEqual('success');
    });
    it('should call router.navigate if server error', () => {
      spyOn(router, 'navigate');
      postService.getPost.and.returnValue(throwError(() => {
        const error = new Error('Server Error');
        (error as any).status = 500;
        return error;
      }));
      component.getPost();
      expect(router.navigate).toHaveBeenCalledWith(['/server-error']);
    });
  });
  describe('getLikes() tests', () => {
    it('should set totalLikes', () => {
      expect(component.likeCount).toEqual(1);
    });
    it('should call router.navigate if server error', () => {
      spyOn(router, 'navigate');
      LikeService.getPostLikes.and.returnValue(throwError(() => {
        const error = new Error('Server Error');
        (error as any).status = 500;
        return error;
      }));
      component.getLikes();
      expect(router.navigate).toHaveBeenCalledWith(['/server-error']);
    });
  });
  describe('getComments() tests', () => {
    it('should set commentCount', () => {
      const response = ApiResponseMock([CommentMock()]);
      commentsService.getComments.and.returnValue(of(response));
      component.getComments();
      expect(component.commentsResponse).toEqual(response);
    });
    it('should call router.navigate if server error', () => {
      spyOn(router, 'navigate');
      commentsService.getComments.and.returnValue(throwError(() => {
        const error = new Error('Server Error');
        (error as any).status = 500;
        return error;
      }));
      component.getComments();
      expect(router.navigate).toHaveBeenCalledWith(['/server-error']);
    });
    it('should call getCommentPage if link', () => {
      const response = ApiResponseMock([CommentMock()]);
      commentsService.getCommentPage.and.returnValue(of(response));
      component.getComments('link');
      expect(commentsService.getCommentPage).toHaveBeenCalledWith('link');
    });
    it('should call createComment', () => {
      const response = CommentMock();
      commentsService.createComment.and.returnValue(of(response));
      component.commentForm.get('comment')?.setValue('comment');
      component.postId = 1;
      component.addComment();
      expect(commentsService.createComment).toHaveBeenCalledWith(1, 'comment');
    });
  });
  describe('addComment() tests', () => {
    it('should call getComments', () => {
      spyOn(component, 'getComments');
      component.commentForm.get('comment')?.setValue('comment');
      component.postId = 1;
      commentsService.createComment.and.returnValue(of(CommentMock()));
      component.addComment();
      expect(component.getComments).toHaveBeenCalled();
    });
    it('should call toastrService.success', () => {
      component.commentForm.get('comment')?.setValue('comment');
      component.postId = 1;
      commentsService.createComment.and.returnValue(of(CommentMock()));
      component.addComment();
      expect(toastrService.success).toHaveBeenCalled();
    });
    it('should call toastrService.error', () => {
      component.commentForm.get('comment')?.setValue('comment');
      component.postId = 1;
      commentsService.createComment.and.returnValue(throwError(() => {
        const error = new Error('Server Error');
        (error as any).status = 400;
        return error;
      }));
      component.addComment();
      expect(toastrService.error).toHaveBeenCalled();
    });
    it('should call router.navigate if server error', () => {
      spyOn(router, 'navigate');
      component.commentForm.get('comment')?.setValue('comment');
      component.postId = 1;
      commentsService.createComment.and.returnValue(throwError(() => {
        const error = new Error('Server Error');
        (error as any).status = 500;
        return error;
      }));
      component.addComment();
      expect(router.navigate).toHaveBeenCalledWith(['/server-error']);
    });
    it('should call toast error if comment is not valid', () => {
      component.commentForm.get('comment')?.setValue('');
      component.addComment();
      expect(toastrService.error).toHaveBeenCalled();
    });
  });
  describe('form tests', () => {
    it('should build form', () => {
      component.buildForm();
      expect(component.commentForm).toBeTruthy();
    });
    it('should set comment', () => {
      component.commentForm.get('comment')?.setValue('comment');
      expect(component.commentForm.get('comment')?.value).toEqual('comment');
    });
    it('should call addComment', () => {
      spyOn(component, 'addComment');
      component.commentForm.get('comment')?.setValue('comment');
      component.postId = 1;
      component.addComment();
      expect(component.addComment).toHaveBeenCalled();
    });
    it('should call getComments', () => {
      spyOn(component, 'getComments');
      component.commentForm.get('comment')?.setValue('comment');
      component.postId = 1;
      commentsService.createComment.and.returnValue(of(CommentMock()));
      component.addComment();
      expect(component.getComments).toHaveBeenCalled();
    });
    it('should mark form as invalid if field is empty', () => {
      component.commentForm.get('comment')?.setValue('');
      expect(component.commentForm.get('comment')?.invalid).toBeTruthy();
    });
    it('should mark form as invalid if field is too long', () => {
      component.commentForm.get('comment')?.setValue('a'.repeat(1001));
      expect(component.commentForm.get('comment')?.invalid).toBeTruthy();
    });
    it('should mark form as invalid if field is full with white spaces', () => {
      component.commentForm.get('comment')?.setValue(' '.repeat(1000));
      expect(component.commentForm.get('comment')?.invalid).toBeTruthy();
    });
    it('should mark form as valid if field is valid', () => {
      component.commentForm.get('comment')?.setValue('comment');
      expect(component.commentForm.get('comment')?.valid).toBeTruthy();
    });
  });
});
