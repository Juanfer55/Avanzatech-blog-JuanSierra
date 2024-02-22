import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListLikesComponent } from './list-likes.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApiResponseMock } from '../../testing/mocks/apiResponse.mocks';
import { LikeMock } from '../../testing/mocks/like.mocks';

fdescribe('ListLikesComponent', () => {
  let component: ListLikesComponent;
  let fixture: ComponentFixture<ListLikesComponent>;
  let likesResponse = ApiResponseMock([LikeMock()]);

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
  });
});
