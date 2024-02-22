import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerErrorComponent } from './server-error.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterTestingModule } from '@angular/router/testing';

fdescribe('ServerErrorComponent', () => {
  let component: ServerErrorComponent;
  let fixture: ComponentFixture<ServerErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerErrorComponent, FontAwesomeModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('render test', () => {
    it('should render the component', () => {
      const compiled = fixture.nativeElement;
      const title = compiled.querySelector('h1');
      const parraph = compiled.querySelector('p');
      const button = compiled.querySelector('button');
      expect(title).toBeTruthy();
      expect(parraph).toBeTruthy();
      expect(button).toBeTruthy();
    });
  })
});
