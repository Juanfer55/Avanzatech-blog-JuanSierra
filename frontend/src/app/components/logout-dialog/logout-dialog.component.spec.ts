import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoutDialogComponent } from './logout-dialog.component';
import { DialogRef } from '@angular/cdk/dialog';

describe('LogoutDialogComponent', () => {
  let component: LogoutDialogComponent;
  let fixture: ComponentFixture<LogoutDialogComponent>;
  let dialogRef: jasmine.SpyObj<DialogRef>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoutDialogComponent],
      providers: [
        {
          provide: DialogRef,
          useValue: jasmine.createSpyObj('DialogRef', ['close']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoutDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(DialogRef) as jasmine.SpyObj<DialogRef>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('logoutConfirmation', () => {
    it('should close the dialog with the passed confirmation => true', () => {
      component.logoutConfirmation(true);
      expect(dialogRef.close).toHaveBeenCalledWith(true);
    });
    it('should close the dialog with the passed confirmation => false', () => {
      component.logoutConfirmation(false);
      expect(dialogRef.close).toHaveBeenCalledWith(false);
    });
  });
  describe('render test', () => {
    it('should render the logout dialog', () => {
      const compiled = fixture.debugElement;
      const message = compiled.nativeElement.querySelector('[data-testid="logout-text"]');
      const confirmButton = compiled.nativeElement.querySelector('[data-testid="logout-button"]');
      const cancelButton = compiled.nativeElement.querySelector('[data-testid="cancel-button"]');

      expect(message).toBeTruthy();
      expect(confirmButton).toBeTruthy();
      expect(cancelButton).toBeTruthy();
    });
  });
});
