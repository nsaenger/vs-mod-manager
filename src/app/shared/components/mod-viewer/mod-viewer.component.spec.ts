import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModViewerComponent } from './mod-viewer.component';

describe('ModViewerComponent', () => {
  let component: ModViewerComponent;
  let fixture: ComponentFixture<ModViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
