import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OilReadingsListComponent } from './oil-readings-list.component';

describe('OilReadingsListComponent', () => {
  let component: OilReadingsListComponent;
  let fixture: ComponentFixture<OilReadingsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OilReadingsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OilReadingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
