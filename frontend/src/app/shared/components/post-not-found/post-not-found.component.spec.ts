import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostNotFoundComponent } from './post-not-found.component';

fdescribe('PostNotFoundComponent', () => {
  let component: PostNotFoundComponent;
  let fixture: ComponentFixture<PostNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostNotFoundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('render tests', () => {
    it('should render', () => {
      const compiled = fixture.nativeElement;
      const icon = compiled.querySelector('fa-icon');
      const title = compiled.querySelector('h1');
      const message = compiled.querySelector('p');
      expect(compiled).toBeTruthy();
      expect(icon).toBeTruthy();
      expect(title).toBeTruthy();
      expect(message).toBeTruthy();
    });
  });
});
