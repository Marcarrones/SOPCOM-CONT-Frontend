import { Component, DoCheck, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MaterialModule } from '../shared/material.module';
import { ContextService } from '../../services/context.service';
import { Context } from '../../models/context';
import { MapFull, MapSimple } from '../../models/map';
import { MapService } from '../../services/map.service';
import { MapGraphComponent } from "../map-graph/map-graph.component";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
    MaterialModule,
    HeaderComponent,
    MapGraphComponent
],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent implements OnChanges {
    @Input() public selectedContext : Context | undefined = undefined;
    public selectedMap: MapFull | undefined = undefined;

    constructor(
        private contextService: ContextService,
        private mapService: MapService,
    ) { 
        this.contextService.CurrentContext.subscribe(data => this.selectedContext = data);
        this.mapService.selectedMap.subscribe(data => this.selectedMap = data);
    }

    ngOnChanges(changes: SimpleChanges): void {
        throw new Error('Method not implemented.');
    }
}
