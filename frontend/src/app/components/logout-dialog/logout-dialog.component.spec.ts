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
});
