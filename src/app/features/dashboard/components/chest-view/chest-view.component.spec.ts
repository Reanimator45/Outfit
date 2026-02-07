import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChestViewComponent } from './chest-view.component';

describe('ChestViewComponent', () => {
  let component: ChestViewComponent;
  let fixture: ComponentFixture<ChestViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChestViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
