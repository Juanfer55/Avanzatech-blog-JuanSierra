import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListCommentsComponent } from './list-comments.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApiResponseMock } from '../../testing/mocks/apiResponse.mocks';
import { generateCommentsMock } from '../../testing/mocks/comment.mocks';
import { By } from '@angular/platform-browser';

fdescribe('ListCommentsComponent', () => {
  let component: ListCommentsComponent;
  let fixture: ComponentFixture<ListCommentsComponent>;
  const comments = generateCommentsMock(10);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCommentsComponent, FontAwesomeModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCommentsComponent);
    component = fixture.componentInstance;
    component.commentsResponse = ApiResponseMock(comments, 10, 1, 2);
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnChanges', () => {
    it('should set comments', () => {
      expect(component.comments).toEqual(comments);
    });
    it('should set commentCount', () => {
      expect(component.commentCount).toEqual(10);
    });
    it('should set commentsTotalPages', () => {
      expect(component.commentsTotalPages).toEqual(2);
    });
    it('should set commentsCurrentPage', () => {
      expect(component.commentsCurrentPage).toEqual(1);
    });
    it('should set commentsPreviousPage', () => {
      expect(component.commentsPreviousPage).toEqual('link-previous-page');
    });
    it('should set commentsNextPage', () => {
      expect(component.commentsNextPage).toEqual('link-next-page');
    });
  });
  describe('commentPageChange', () => {
    it('should emit pageChange', () => {
      spyOn(component.pageChange, 'emit');
      component.commentPageChange('2');
      expect(component.pageChange.emit).toHaveBeenCalledWith('2');
    });
  });
  describe('reder tests', () => {
    it('should render the title', () => {
      const title = fixture.nativeElement.querySelector('h1');
      expect(title.textContent).toContain('Comments');
    });
    it('should contain the comments', () => {
      const comments = fixture.debugElement.queryAll(By.css('[data-testid="comment-list"]'));
      expect(comments.length).toEqual(10);
    });
    it('should contain the pagination', () => {
      const pagination = fixture.debugElement.query(By.css('[data-testid="pagination"]'));
      expect(pagination).toBeTruthy();
    });
  });
});
