import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouncilViewComponent } from './council-view.component';

describe('CouncilViewComponent', () => {
  let component: CouncilViewComponent;
  let fixture: ComponentFixture<CouncilViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouncilViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CouncilViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
