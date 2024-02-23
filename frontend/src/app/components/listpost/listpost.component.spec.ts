import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ListpostComponent } from './listpost.component';
import { AuthService } from '../../services/auth.service';
import { LikesService } from '../../services/likes.service';
import { CommentsService } from '../../services/comments.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PostWithExcerptMock } from '../../testing/mocks/post.mocks';
import { UserProfileMock } from '../../testing/mocks/user.mocks';
import { Observable, of, throwError } from 'rxjs';
import { LikeMock } from '../../testing/mocks/like.mocks';
import { ApiResponseMock } from '../../testing/mocks/apiResponse.mocks';
import { CommentMock } from '../../testing/mocks/comment.mocks';
import { Comment } from '../../models/comments.model';
import { Dialog } from '@angular/cdk/dialog';

fdescribe('ListpostComponent', () => {
  let component: ListpostComponent;
  let fixture: ComponentFixture<ListpostComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let likesService: jasmine.SpyObj<LikesService>;
  let commentsService: jasmine.SpyObj<CommentsService>;
  let dialog: jasmine.SpyObj<Dialog>;
  let router: jasmine.SpyObj<Router>;
  let commentMock: Comment = CommentMock();
  let like = LikeMock();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListpostComponent, RouterTestingModule],
      providers: [
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj('AuthService', [
            'logStatus$',
            'userProfile$',
          ]),
        },
        {
          provide: LikesService,
          useValue: jasmine.createSpyObj('LikesService', [
            'getLikePage',
            'getPostLikes',
            'getUserLike',
            'likePost',
            'UnlikePost',
          ]),
        },
        {
          provide: CommentsService,
          useValue: jasmine.createSpyObj('CommentsService', ['getComments']),
        },
        {
          provide: Dialog,
          useValue: jasmine.createSpyObj('Dialog', ['open']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListpostComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    likesService = TestBed.inject(LikesService) as jasmine.SpyObj<LikesService>;
    commentsService = TestBed.inject(
      CommentsService
    ) as jasmine.SpyObj<CommentsService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    dialog = TestBed.inject(Dialog) as jasmine.SpyObj<Dialog>;

    component.post = PostWithExcerptMock();
    component.user = UserProfileMock();
    authService.userProfile$ = of(UserProfileMock());
    likesService.getPostLikes.and.returnValue(of(ApiResponseMock([like])));
    likesService.getUserLike.and.returnValue(of(ApiResponseMock([like])));
    commentsService.getComments.and.returnValue(
      of(ApiResponseMock([commentMock]))
    );
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('getLikes() tests', () => {
    it('should get the likes and set the total likes', () => {
      component.getLikes();
      expect(component.totalLikes).toBe(1);
    });
    it('should set the likes response', () => {
      expect(component.likesResponse).toEqual(ApiResponseMock([like]));
    });
    it('should get the likes with a link', fakeAsync(() => {
      const mockdata = ApiResponseMock([like]);
      likesService.getLikePage.and.returnValue(of(mockdata));
      component.getLikes('link');
      fixture.detectChanges();
      tick();
      expect(likesService.getLikePage).toHaveBeenCalledWith('link');
    }));
    it('should handle server errors', fakeAsync(() => {
      likesService.getPostLikes.and.returnValue(throwError({ status: 500 }));
      component.getLikes();
      fixture.detectChanges();
      tick();
      expect(router.navigate).toHaveBeenCalledWith(['/server-error']);
    }));
  });
  describe('getComments() tests', () => {
    it('should get the comments and set the comment count', () => {
      component.getComments();
      expect(component.commentCount).toBe(1);
    });
    it('should handle server errors', fakeAsync(() => {
      commentsService.getComments.and.returnValue(throwError({ status: 500 }));
      component.getComments();
      fixture.detectChanges();
      tick();
      expect(router.navigate).toHaveBeenCalledWith(['/server-error']);
    }));
  });
  describe('getUserLike() tests', () => {
    it('should get the user like and set the user like', () => {
      const mokcData = ApiResponseMock([like]);
      likesService.getUserLike.and.returnValue(of(mokcData));
      component.getUserLike();
      expect(component.like).toEqual(like);
      expect(component.postIsLiked).toBeTruthy();
    });
    it('should handle server errors', fakeAsync(() => {
      likesService.getUserLike.and.returnValue(throwError({ status: 500 }));
      component.getUserLike();
      fixture.detectChanges();
      tick();
      expect(router.navigate).toHaveBeenCalledWith(['/server-error']);
    }));
  });
  describe('likePost() tests', () => {
    it('should like the post, set the like status and get the likes', fakeAsync(() => {
      spyOn(component, 'getLikes');
      const mockDta = like;
      likesService.likePost.and.returnValue(of(mockDta));
      component.likePost();
      expect(likesService.likePost).toHaveBeenCalled();
      expect(component.postIsLiked).toBeTruthy();
      expect(component.getLikes).toHaveBeenCalled();
    }));
    it('should handle server errors', fakeAsync(() => {
      likesService.likePost.and.returnValue(throwError({ status: 500 }));
      component.likePost();
      fixture.detectChanges();
      tick();
      expect(router.navigate).toHaveBeenCalledWith(['/server-error']);
    }));
  });
  describe('unlikePost() tests', () => {
    it('should unlike the post, set the like status and get the likes', fakeAsync(() => {
      spyOn(component, 'getLikes');
      likesService.UnlikePost.and.returnValue(of({}));
      component.unlikePost();
      expect(likesService.UnlikePost).toHaveBeenCalled();
      expect(component.postIsLiked).toBeFalsy();
      expect(component.getLikes).toHaveBeenCalled();
    }));
    it('should handle server errors', fakeAsync(() => {
      likesService.UnlikePost.and.returnValue(throwError({ status: 500 }));
      component.unlikePost();
      fixture.detectChanges();
      tick();
      expect(router.navigate).toHaveBeenCalledWith(['/server-error']);
    }));
  });
  describe('deletePost() tests', () => {
    it('should emmit and event with the post id', () => {
      spyOn(component.deletePostId, 'emit');
      component.deletePost();
      expect(component.deletePostId.emit).toHaveBeenCalledWith(component.post.id);
    });
  });
  describe('hasEditPermission() tests', () => {
    it('should return true if the user is not logged in and the public permission is read-and-edit', () => {
      component.user = null;
      component.post.public_permission = 'read-and-edit';
      expect(component.hasEditPermission()).toBeTruthy();
    });
    it('should return false if the user is not logged in and the public permission is not read-and-edit', () => {
      component.user = null;
      component.post.public_permission = 'read-only';
      expect(component.hasEditPermission()).toBeFalsy();
    });
    it('should return true if the user is an admin', () => {
      component.user = UserProfileMock();
      component.user.is_admin = true;
      expect(component.hasEditPermission()).toBeTruthy();
    });
    it('should return true if the user is the author and the author permission is read-and-edit', () => {
      component.user = UserProfileMock();
      component.user.id = component.post.author.id;
      component.post.author_permission = 'read-and-edit';
      expect(component.hasEditPermission()).toBeTruthy();
    });
    it('should return false if the user is the author and the author permission is not read-and-edit', () => {
      component.user = UserProfileMock();
      component.user.is_admin = false;
      component.user.id = 1;
      component.post.author.id = 1;
      component.post.author_permission = 'read-only';
      expect(component.hasEditPermission()).toBeFalsy();
    });
    it('should return true if the user is in the same team and the team permission is read-and-edit', () => {
      component.user = UserProfileMock();
      component.user.team.id = component.post.author.team.id;
      component.post.team_permission = 'read-and-edit';
      expect(component.hasEditPermission()).toBeTruthy();
    });
    it('should return false if the user is in the same team and the team permission is not read-and-edit', () => {
      component.user = UserProfileMock();
      component.user.is_admin = false;
      component.user.team.id = component.post.author.team.id;
      component.post.team_permission = 'read-only';
      component.post.authenticated_permission = 'read-only';
      component.post.public_permission = 'read-only';
      component.post.author_permission = 'read-only';
      expect(component.hasEditPermission()).toBeFalsy();
    });
    it('should return false if the user is on a different team and the team permission is read-and-edit', () => {
      component.user = UserProfileMock();
      component.user.is_admin = false;
      component.user.team.id = component.post.author.team.id + 1;
      component.post.team_permission = 'read-and-edit';
      component.post.authenticated_permission = 'read-only';
      component.post.public_permission = 'read-only';
      component.post.author_permission = 'read-only';
      expect(component.hasEditPermission()).toBeFalsy();
    });
    it('should return true if the user is on a different team and the authenticated permission is read-and-edit', () => {
      component.user = UserProfileMock();
      component.user.is_admin = false;
      component.user.team.id = component.post.author.team.id + 1;
      component.post.team_permission = 'read-only';
      component.post.authenticated_permission = 'read-and-edit';
      component.post.public_permission = 'read-only';
      component.post.author_permission = 'read-only';
      expect(component.hasEditPermission()).toBeTruthy();
    });
    it('should return false if the user is on a different team and the authenticated permission is not read-and-edit', () => {
      component.user = UserProfileMock();
      component.user.is_admin = false;
      component.user.team.id = component.post.author.team.id + 1;
      component.post.team_permission = 'read-only';
      component.post.authenticated_permission = 'read-only';
      component.post.public_permission = 'read-only';
      component.post.author_permission = 'read-only';
      expect(component.hasEditPermission()).toBeFalsy();
    });
  });
  describe('detailView() tests', () => {
    it('should navigate to the detail view', () => {
      component.detailView();
      expect(router.navigate).toHaveBeenCalledWith([
        '/post',
        component.post.id,
      ]);
    });
  });
  describe('editView() tests', () => {
    it('should navigate to the edit view', () => {
      component.editView();
      expect(router.navigate).toHaveBeenCalledWith([
        '/update-post',
        component.post.id,
      ]);
    });
  });
  describe('render tests', () => {
    it('should render the component', () => {
      const compiled = fixture.nativeElement;
      const pageContainer = compiled.querySelector(
        '[data-testid="page-container"]'
      );
      expect(pageContainer).toBeTruthy();
    });
    it('should render the post title', () => {
      const compiled = fixture.nativeElement;
      const postTitle = compiled.querySelector('[data-testid="post-title"]');
      expect(postTitle).toBeTruthy();
    });
    it('should render the team name', () => {
      const compiled = fixture.nativeElement;
      const teamName = compiled.querySelector('[data-testid="team-name"]');
      expect(teamName).toBeTruthy();
    });
    it('should render the author username', () => {
      const compiled = fixture.nativeElement;
      const authorUsername = compiled.querySelector(
        '[data-testid="author-username"]'
      );
      expect(authorUsername).toBeTruthy();
    });
    it('should render the post date', () => {
      const compiled = fixture.nativeElement;
      const postDate = compiled.querySelector('[data-testid="post-date"]');
      expect(postDate).toBeTruthy();
    });
    it('should render the post excerpt', () => {
      const compiled = fixture.nativeElement;
      const postExcerpt = compiled.querySelector(
        '[data-testid="post-excerpt"]'
      );
      expect(postExcerpt).toBeTruthy();
    });
    it('should render the like count', () => {
      const compiled = fixture.nativeElement;
      const likeCount = compiled.querySelector('[data-testid="like-count"]');
      expect(likeCount).toBeTruthy();
    });
    it('should render the comment count', () => {
      const compiled = fixture.nativeElement;
      const commentCount = compiled.querySelector(
        '[data-testid="comment-count"]'
      );
      expect(commentCount).toBeTruthy();
    });
    it('should render the like button', () => {
      const compiled = fixture.nativeElement;
      const likeButton = compiled.querySelector('[data-testid="like-button"]');
      expect(likeButton).toBeTruthy();
    });
    it('should render the comment button', () => {
      const compiled = fixture.nativeElement;
      const commentButton = compiled.querySelector(
        '[data-testid="comment-button"]'
      );
      expect(commentButton).toBeTruthy();
    });
    it('should render the edit button', () => {
      const compiled = fixture.nativeElement;
      const editButton = compiled.querySelector('[data-testid="edit-button"]');
      expect(editButton).toBeTruthy();
    });
    it('should render the delete button', () => {
      const compiled = fixture.nativeElement;
      const deleteButton = compiled.querySelector(
        '[data-testid="delete-button"]'
      );
      expect(deleteButton).toBeTruthy();
    });
  });
});
