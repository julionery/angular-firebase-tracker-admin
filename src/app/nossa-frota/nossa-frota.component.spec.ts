import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NossaFrotaComponent } from './nossa-frota.component';

describe('NossaFrotaComponent', () => {
  let component: NossaFrotaComponent;
  let fixture: ComponentFixture<NossaFrotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NossaFrotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NossaFrotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
