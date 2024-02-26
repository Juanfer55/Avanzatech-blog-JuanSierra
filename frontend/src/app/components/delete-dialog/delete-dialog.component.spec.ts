import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteDialogComponent } from './delete-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

describe('DeleteDialogComponent', () => {
  let component: DeleteDialogComponent;
  let fixture: ComponentFixture<DeleteDialogComponent>;
  let dialogRef: jasmine.SpyObj<DialogRef>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteDialogComponent, FontAwesomeModule],
      providers: [
        {
          provide: DialogRef,
          useValue: jasmine.createSpyObj('DialogRef', ['close']),
        },
        {
          provide: DIALOG_DATA,
          useValue: {
            title: 'title',
          },
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DialogRef) as jasmine.SpyObj<DialogRef>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('delete method', () => {
    it('should close the dialog with deletePost as true', () => {
      component.delete(true);
      expect(dialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should close the dialog with deletePost as false', () => {
      component.delete(false);
      expect(dialogRef.close).toHaveBeenCalledWith(false);
    });
  });
  describe('render tests', () => {
    it('should render warning icon', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('fa-icon')).toBeTruthy();
    });

    it('should render warning message', () => {
      const compiled = fixture.nativeElement;
      const warningMsg = compiled.querySelector('[data-testid="warning-msg"]');
      expect(warningMsg).toBeTruthy();
    });

    it('should render post info', () => {
      const compiled = fixture.nativeElement;
      const postInfo = compiled.querySelector('[data-testid="post-info"]');
      expect(postInfo).toBeTruthy();
    });

    it('should render delete button', () => {
      const compiled = fixture.nativeElement;
      const deleteBtn = compiled.querySelector('[data-testid="delete-btn"]');
      expect(deleteBtn).toBeTruthy();
    });

    it('should render cancel button', () => {
      const compiled = fixture.nativeElement;
      const cancelBtn = compiled.querySelector('[data-testid="cancel-btn"]');
      expect(cancelBtn).toBeTruthy();
    });
  });
});
