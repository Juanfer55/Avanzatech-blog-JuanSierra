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

fdescribe('DetailPostComponent', () => {
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
  describe('ngOnInit', () => {
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
  describe('getPost', () => {
    it('should set post', () => {
      expect(component.post).toEqual(postMock);
    });
    it('should set requestStatus', () => {
      expect(component.requestStatus).toEqual('success');
    });
    it('should call router.navigate', () => {
      spyOn(router, 'navigate');
      postService.getPost.and.returnValue(throwError({status: 0}));
      component.getPost();
      expect(router.navigate).toHaveBeenCalledWith(['/server-error']);
    });
  });
  describe('getLikes', () => {
    it('should set totalLikes', () => {
      expect(component.likeCount).toEqual(1);
    });
    it('should call router.navigate', () => {
      spyOn(router, 'navigate');
      LikeService.getPostLikes.and.returnValue(throwError({status: 0}));
      component.getLikes();
      expect(router.navigate).toHaveBeenCalledWith(['/server-error']);
    });
  });
  describe('getComments', () => {
    it('should set commentCount', () => {
      const response = ApiResponseMock([CommentMock()]);
      commentsService.getComments.and.returnValue(of(response));
      component.getComments();
      expect(component.commentsResponse).toEqual(response);
    });
    it('should call router.navigate', () => {
      spyOn(router, 'navigate');
      commentsService.getComments.and.returnValue(throwError({status: 0}));
      component.getComments();
      expect(router.navigate).toHaveBeenCalledWith(['/server-error']);
    });
  });
});
