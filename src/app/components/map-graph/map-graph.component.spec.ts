import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapGraphComponent } from './map-graph.component';

describe('MapGraphComponent', () => {
  let component: MapGraphComponent;
  let fixture: ComponentFixture<MapGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
