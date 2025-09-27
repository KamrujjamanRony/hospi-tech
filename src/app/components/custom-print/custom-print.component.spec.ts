import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPrintComponent } from './custom-print.component';

describe('CustomPrintComponent', () => {
  let component: CustomPrintComponent;
  let fixture: ComponentFixture<CustomPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomPrintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
