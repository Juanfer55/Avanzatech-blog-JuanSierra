// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { LogoutDialogComponent } from './logout-dialog.component';

// describe('LogoutDialogComponent', () => {
//   let component: LogoutDialogComponent;
//   let fixture: ComponentFixture<LogoutDialogComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [LogoutDialogComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(LogoutDialogComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
//   describe('LogoutDialogComponent', () => {
//   it('should call dialogRef.close() when closeModal() is called', () => {
//     const dialogRefSpy = jasmine.createSpyObj('DialogRef', ['close']);
//     const component = new LogoutDialogComponent(dialogRefSpy);

//     component.closeModal();

//     expect(dialogRefSpy.close).toHaveBeenCalled();
//   });

//   it('should call dialogRef.close() with confirmation when sendConfirmationToComponent() is called', () => {
//     const dialogRefSpy = jasmine.createSpyObj('DialogRef', ['close']);
//     const component = new LogoutDialogComponent(dialogRefSpy);

//     component.sendConfirmationToComponent(true);

//     expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
//   });
//   });
// });
