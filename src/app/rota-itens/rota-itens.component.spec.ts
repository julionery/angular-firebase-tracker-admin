import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RotaItensComponent } from './rota-itens.component';

describe('RotaItensComponent', () => {
  let component: RotaItensComponent;
  let fixture: ComponentFixture<RotaItensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RotaItensComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RotaItensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
