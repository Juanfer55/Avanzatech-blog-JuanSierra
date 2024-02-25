import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdatePostComponent } from './update-post.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PostService } from '../../services/postservice.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PostMock } from '../../testing/mocks/post.mocks';

describe('UpdatePostComponent', () => {
  let component: UpdatePostComponent;
  let fixture: ComponentFixture<UpdatePostComponent>;
  let postService: jasmine.SpyObj<PostService>;
  let toastr: jasmine.SpyObj<ToastrService>;
  let router: jasmine.SpyObj<Router>;
  let route: jasmine.SpyObj<ActivatedRoute>;
  const post = PostMock();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePostComponent, FontAwesomeModule, ReactiveFormsModule, RouterTestingModule],
      providers: [
        {
          provide: PostService,
          useValue: jasmine.createSpyObj('PostService', ['updatePost', 'getPost']),
        },
        {
          provide: ToastrService,
          useValue: jasmine.createSpyObj('ToastrService', ['success', 'error']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePostComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    toastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;

    route.params = of({ id: 1 });
    spyOn(router, 'navigate');
    postService.getPost.and.returnValue(of(post));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit() tests', () => {
    it('should get post', () => {
      component.ngOnInit();
      expect(postService.getPost).toHaveBeenCalled();
    });
    it('should set post', () => {
      component.ngOnInit();
      expect(component.post).toEqual(post);
    });
    it('should set postId', () => {
      component.ngOnInit();
      expect(component.postId).toEqual(1);
    });
    it('should set requestStatus to success', () => {
      component.ngOnInit();
      expect(component.requestStatus).toEqual('success');
    });
  });
  describe('buildForm() tests', () => {
    it('should build the form according to the post', () => {
      expect(component.updatePostForm.value).toEqual({
        title: post.title,
        content: post.content,
        public_permission: post.public_permission,
        authenticated_permission: post.authenticated_permission,
        team_permission: post.team_permission,
        author_permission: post.author_permission,
      });
    });

    it('should set title as valid', () => {
      component.updatePostForm.get('title')?.setValue('valid title');
      expect(component.updatePostForm.get('title')?.valid).toBeTruthy();
    });
    it('should set title as invalid', () => {
      component.updatePostForm.get('title')?.setValue('');
      expect(component.updatePostForm.get('title')?.valid).toBeFalsy();
    });
    it('should set content as valid', () => {
      component.updatePostForm.get('content')?.setValue('valid content');
      expect(component.updatePostForm.get('content')?.valid).toBeTruthy();
    });
    it('should set content as invalid', () => {
      component.updatePostForm.get('content')?.setValue('');
      expect(component.updatePostForm.get('content')?.valid).toBeFalsy();
    });
    it('should set public_permission as valid', () => {
      component.updatePostForm.get('public_permission')?.setValue(1);
      expect(component.updatePostForm.get('public_permission')?.valid).toBeTruthy();
    });
    it('should set public_permission as invalid', () => {
      component.updatePostForm.get('public_permission')?.setValue(null);
      expect(component.updatePostForm.get('public_permission')?.valid).toBeFalsy();
    });
    it('should set authenticated_permission as valid', () => {
      component.updatePostForm.get('authenticated_permission')?.setValue(1);
      expect(component.updatePostForm.get('authenticated_permission')?.valid).toBeTruthy();
    });
    it('should set authenticated_permission as invalid', () => {
      component.updatePostForm.get('authenticated_permission')?.setValue(null);
      expect(component.updatePostForm.get('authenticated_permission')?.valid).toBeFalsy();
    });
    it('should set team_permission as valid', () => {
      component.updatePostForm.get('team_permission')?.setValue(1);
      expect(component.updatePostForm.get('team_permission')?.valid).toBeTruthy();
    });
    it('should set team_permission as invalid', () => {
      component.updatePostForm.get('team_permission')?.setValue(null);
      expect(component.updatePostForm.get('team_permission')?.valid).toBeFalsy();
    });
    it('should set author_permission as valid', () => {
      component.updatePostForm.get('author_permission')?.setValue(1);
      expect(component.updatePostForm.get('author_permission')?.valid).toBeTruthy();
    });
    it('should set author_permission as invalid', () => {
      component.updatePostForm.get('author_permission')?.setValue(null);
      expect(component.updatePostForm.get('author_permission')?.valid).toBeFalsy();
    });
  });
  describe('getPost() tests', () => {
    it('should get post', () => {
      postService.getPost.and.returnValue(of(post));
      component.getPost();
      expect(postService.getPost).toHaveBeenCalled();
    });
    it('should set post', () => {
      postService.getPost.and.returnValue(of(post));
      component.getPost();
      expect(component.post).toEqual(post);
    });
    it('should set requestStatus to success', () => {
      postService.getPost.and.returnValue(of(post));
      component.getPost();
      expect(component.requestStatus).toEqual('success');
    });
    it('should set requestStatus to error if error', () => {
      postService.getPost.and.returnValue(throwError({ status: 0 }));
      component.getPost();
      expect(component.requestStatus).toEqual('error');
    });
    it('should call router.navigate if server error', () => {
      postService.getPost.and.returnValue(throwError({ status: 0 }));
      component.getPost();
      expect(router.navigate).toHaveBeenCalledWith(['/server-error']);
    });
  });
  describe('updatePost() tests', () => {
    it('should call updatePost() and return success', () => {
      component.updatePostForm.get('title')?.setValue('Test Title');
      component.updatePostForm.get('content')?.setValue('Test Content');
      postService.updatePost.and.returnValue(of(post));
      component.updatePost();
      expect(postService.updatePost).toHaveBeenCalled();
      expect(toastr.success).toHaveBeenCalled();
    });
    it('should call updatePost() and return a server error', () => {
      component.updatePostForm.get('title')?.setValue('Test Title');
      component.updatePostForm.get('content')?.setValue('Test Content');
      postService.updatePost.and.returnValue(throwError({ status: 500 }));
      component.updatePost();
      expect(postService.updatePost).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/server-error']);
    });
    it('should call updatePost() and return a form error', () => {
      component.updatePostForm.get('title')?.setValue('');
      component.updatePostForm.get('content')?.setValue('');
      component.updatePost();
      expect(postService.updatePost).not.toHaveBeenCalled();
      expect(toastr.error).toHaveBeenCalled();
    });
    it('should call updatePost() and return a form error', () => {
      component.updatePostForm.get('title')?.setValue('Test Title');
      component.updatePostForm.get('content')?.setValue('Test Content');
      component.updatePostForm.get('public_permission')?.setValue(null);
      component.updatePostForm.get('authenticated_permission')?.setValue(null);
      component.updatePostForm.get('team_permission')?.setValue(null);
      component.updatePostForm.get('author_permission')?.setValue(null);
      component.updatePost();
      expect(postService.updatePost).not.toHaveBeenCalled();
      expect(toastr.error).toHaveBeenCalled();
    })
  });
  describe('reder tests', () => {
    it('should render the form', () => {
      const compiled = fixture.nativeElement;
      const form = compiled.querySelector('form');
      expect(form).toBeTruthy();
    });
    it('should render the title input', () => {
      const compiled = fixture.nativeElement;
      const title = compiled.querySelector('input[name="title"]');
      expect(title).toBeTruthy();
    });
    it('should render the content input', () => {
      const compiled = fixture.nativeElement;
      const content = compiled.querySelector('textarea[name="content"]');
      expect(content).toBeTruthy();
    });
    it('should render the public_permission input', () => {
      const compiled = fixture.nativeElement;
      const public_permission = compiled.querySelector('select[name="public_permission"]');
      expect(public_permission).toBeTruthy();
    });
    it('should render the authenticated_permission input', () => {
      const compiled = fixture.nativeElement;
      const authenticated_permission = compiled.querySelector('select[name="authenticated_permission"]');
      expect(authenticated_permission).toBeTruthy();
    });
    it('should render the team_permission input', () => {
      const compiled = fixture.nativeElement;
      const team_permission = compiled.querySelector('select[name="team_permission"]');
      expect(team_permission).toBeTruthy();
    });
    it('should render the author_permission input', () => {
      const compiled = fixture.nativeElement;
      const author_permission = compiled.querySelector('select[name="author_permission"]');
      expect(author_permission).toBeTruthy();
    });
    it('should render the submit button', () => {
      const compiled = fixture.nativeElement;
      const submit = compiled.querySelector('button[type="submit"]');
      expect(submit).toBeTruthy();
    });
    it('should render the cancel button', () => {
      const compiled = fixture.nativeElement;
      const cancel = compiled.querySelector('button[type="button"]');
      expect(cancel).toBeTruthy();
    });
    it('should have a routerlink to the homepage', () => {
      const compiled = fixture.nativeElement;
      const cancel = compiled.querySelector('button[type="button"]');
      expect(cancel?.getAttribute('routerLink')).toEqual('/');
    });
  });
});
