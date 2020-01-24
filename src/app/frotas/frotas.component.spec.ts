import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrotasComponent } from './frotas.component';

describe('FrotasComponent', () => {
  let component: FrotasComponent;
  let fixture: ComponentFixture<FrotasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrotasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
