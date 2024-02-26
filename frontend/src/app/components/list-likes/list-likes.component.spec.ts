import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListLikesComponent } from './list-likes.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApiResponseMock } from '../../testing/mocks/apiResponse.mocks';
import { LikeListMock, LikeMock } from '../../testing/mocks/like.mocks';
import { By } from '@angular/platform-browser';

describe('ListLikesComponent', () => {
  let component: ListLikesComponent;
  let fixture: ComponentFixture<ListLikesComponent>;
  let likesResponse = ApiResponseMock(LikeListMock(45), 45, 3, 3);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListLikesComponent, FontAwesomeModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ListLikesComponent);
    component = fixture.componentInstance;
    component.likesResponse = likesResponse;
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnChanges', () => {
    it('should set likes', () => {
      expect(component.likes).toEqual(likesResponse.results);
    });
    it('should set likesTotalPages', () => {
      expect(component.likesTotalPages).toEqual(likesResponse.total_pages);
    });
    it('should set likesCurrentPage', () => {
      expect(component.likesCurrentPage).toEqual(likesResponse.current_page);
    });
    it('should set likesPreviousPage', () => {
      expect(component.likesPreviousPage).toEqual(likesResponse.previous);
    });
    it('should set likesNextPage', () => {
      expect(component.likesNextPage).toEqual(likesResponse.next);
    });
    it('should set likesIsOpen', () => {
      expect(component.likesIsOpen).toEqual(false);
    });
    it('should set default values if likesResponse is null', () => {
      component.likesResponse = null;
      component.ngOnChanges();
      expect(component.likes).toEqual([]);
      expect(component.likesTotalPages).toEqual(0);
      expect(component.likesCurrentPage).toEqual(0);
      expect(component.likesPreviousPage).toEqual(null);
      expect(component.likesNextPage).toEqual(null);
    });
  });
  describe('likePageChange', () => {
    it('should emit pageChange', () => {
      spyOn(component.pageChange, 'emit');
      component.likePageChange('link');
      expect(component.pageChange.emit).toHaveBeenCalledWith('link');
    });
  });
  describe('render tests', () => {
    it('should render', () => {
      const compiled = fixture.nativeElement;
      expect(compiled).toBeTruthy();
    });
    it('should render the list of likes', () => {
      const compiled = fixture.debugElement
      const listLikes = compiled.queryAll(By.css('.list-likes'));
      expect(listLikes).toBeTruthy();
    });
    it('should render navigation buttons', () => {
      const compiled = fixture.debugElement
      const previousButton = compiled.queryAll(By.css('.like-navigation-icon'));
      expect(previousButton).toBeTruthy();
      expect(previousButton.length).toEqual(2);
    });
  });
});
