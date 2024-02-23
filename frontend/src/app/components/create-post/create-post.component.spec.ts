import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePostComponent } from './create-post.component';
import { PostService } from '../../services/postservice.service';
import { ToastrService } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterTestingModule } from '@angular/router/testing';
import { PostWithoutPermissionMock } from '../../testing/mocks/post.mocks';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

fdescribe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;
  let postService: jasmine.SpyObj<PostService>;
  let toastService: jasmine.SpyObj<ToastrService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreatePostComponent,
        FontAwesomeModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: PostService,
          useValue: jasmine.createSpyObj('PostService', ['createPost']),
        },
        {
          provide: ToastrService,
          useValue: jasmine.createSpyObj('ToastrService', ['success', 'error']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePostComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    toastService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('form tests', () => {
    it('should create form with default values', () => {
      console.log(component.createPostForm.value);
      expect(component.createPostForm).toBeTruthy();
      expect(component.createPostForm.value).toEqual({
        title: '',
        content: '',
        public_permission: 2,
        authenticated_permission: 2,
        team_permission: 3,
        author_permission: 3,
      });
    });
    it('should set title as invalid', () => {
      component.createPostForm.get('title')?.setValue('');
      expect(component.createPostForm.get('title')?.valid).toBeFalsy();
    });
    it('should set title as invalid if it is full with white spaces', () => {
      component.createPostForm.get('title')?.setValue('   ');
      expect(component.createPostForm.get('title')?.valid).toBeFalsy();
    });
    it('should set title as valid', () => {
      component.createPostForm.get('title')?.setValue('Test Title');
      expect(component.createPostForm.get('title')?.valid).toBeTruthy();
    });
    it('should set content as invalid', () => {
      component.createPostForm.get('content')?.setValue('');
      expect(component.createPostForm.get('content')?.valid).toBeFalsy();
    });
    it('should set content as invalid if it is full with white spaces', () => {
      component.createPostForm.get('content')?.setValue('   ');
      expect(component.createPostForm.get('content')?.valid).toBeFalsy();
    });
    it('should set content as valid', () => {
      component.createPostForm.get('content')?.setValue('Test Content');
      expect(component.createPostForm.get('content')?.valid).toBeTruthy();
    });
    it('should set public_permission as invalid', () => {
      component.createPostForm.get('public_permission')?.setValue(null);
      expect(component.createPostForm.get('public_permission')?.valid).toBeFalsy();
    });
    it('should set public_permission as valid', () => {
      component.createPostForm.get('public_permission')?.setValue(1);
      expect(component.createPostForm.get('public_permission')?.valid).toBeTruthy();
    });
    it('should set authenticated_permission as invalid', () => {
      component.createPostForm.get('authenticated_permission')?.setValue(null);
      expect(component.createPostForm.get('authenticated_permission')?.valid).toBeFalsy();
    });
    it('should set authenticated_permission as valid', () => {
      component.createPostForm.get('authenticated_permission')?.setValue(1);
      expect(component.createPostForm.get('authenticated_permission')?.valid).toBeTruthy();
    });
    it('should set team_permission as invalid', () => {
      component.createPostForm.get('team_permission')?.setValue(null);
      expect(component.createPostForm.get('team_permission')?.valid).toBeFalsy();
    });
    it('should set team_permission as valid', () => {
      component.createPostForm.get('team_permission')?.setValue(1);
      expect(component.createPostForm.get('team_permission')?.valid).toBeTruthy();
    });
    it('should set author_permission as invalid', () => {
      component.createPostForm.get('author_permission')?.setValue(null);
      expect(component.createPostForm.get('author_permission')?.valid).toBeFalsy();
    });
    it('should set author_permission as valid', () => {
      component.createPostForm.get('author_permission')?.setValue(1);
      expect(component.createPostForm.get('author_permission')?.valid).toBeTruthy();
    });
  });
  describe('createPost() tests', () => {
    it('should call createPost() and return success', () => {
      component.createPostForm.get('title')?.setValue('Test Title');
      component.createPostForm.get('content')?.setValue('Test Content');
      postService.createPost.and.returnValue(of(PostWithoutPermissionMock()));
      component.createPost();
      expect(postService.createPost).toHaveBeenCalled();
      expect(toastService.success).toHaveBeenCalled();
    });
    it('should call createPost() and returna server error', () => {
      component.createPostForm.get('title')?.setValue('Test Title');
      component.createPostForm.get('content')?.setValue('Test Content');
      postService.createPost.and.returnValue(throwError({ status: 500 }));
      component.createPost();
      expect(postService.createPost).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/server-error']);
    });
    it('should call createPost() and return a form error', () => {
      component.createPostForm.get('title')?.setValue('');
      component.createPostForm.get('content')?.setValue('');
      component.createPost();
      expect(toastService.error).toHaveBeenCalled();
    });
  });
});
