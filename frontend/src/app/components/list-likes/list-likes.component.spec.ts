import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLikesComponent } from './list-likes.component';

describe('ListLikesComponent', () => {
  let component: ListLikesComponent;
  let fixture: ComponentFixture<ListLikesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListLikesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListLikesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
