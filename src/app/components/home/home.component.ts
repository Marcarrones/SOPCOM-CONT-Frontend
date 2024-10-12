import { Component, DoCheck, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MaterialModule } from '../../shared/material.module';
import { ContextService } from '../../../services/context.service';
import { Context } from '../../../models/context';
import { MapFull, MapType } from '../../../models/map';
import { MapService } from '../../../services/map.service';
import { MapGraphComponent } from "../map-graph/map-graph.component";
import { MissingCard } from "../missing-card/missing-card.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
    MaterialModule,
    HeaderComponent,
    MapGraphComponent,
    MaterialModule,
    MissingCard,
    CommonModule
],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent {
    @Input() public selectedContext : Context | undefined = undefined;
    public selectedMap: MapFull | undefined = undefined;
    
    public lastMapType: MapType = MapType.All;
    mapTypes = MapType;
    
    constructor(
        private contextService: ContextService,
        private mapService: MapService,
    ) { 
        this.contextService.CurrentContext.subscribe(data => this.selectedContext = data);
        this.mapService.selectedMap.subscribe(data => this.selectedMap = data);
        this.mapService.mapType.subscribe(data => this.lastMapType = data);
    }
    
    onClickMapType(event : Event ,type: MapType) {
        this.mapService.setMapType(type);
      }
}
