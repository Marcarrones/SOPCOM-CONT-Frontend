import { Component, Input } from '@angular/core';
import { MaterialModule } from '../shared/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContextService } from '../../services/context.service';
import { Context } from '../../models/context';
import { CriteriaListComponent } from '../criteria-list/criteria-list.component';
import { MapService } from '../../services/map.service';
import { MapSimple, MapType } from '../../models/map';
import { MatButton } from '@angular/material/button';
import { MethodChunkListComponent } from "../method-chunk-list/method-chunk-list.component";


@Component({
  selector: 'app-navigator',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterLink,
    CriteriaListComponent,
    FormsModule,
    MatButton,
    MethodChunkListComponent
],
  templateUrl: './navigator.component.html',
  styleUrl: './navigator.component.css'
})
export class NavigatorComponent {
  @Input() maxHeight!: number;
  mapTypes = MapType;
  
  public selectedContext: Context | undefined = undefined;
  public selectedMap: MapSimple | undefined = undefined;

  public mapList: MapSimple[] = [];
  
  constructor(
    private contextService: ContextService,
    private mapService: MapService,
  ) {
    this.mapService.selectedMap.subscribe(m => this.setMap(m));
    this.contextService.CurrentContext.subscribe(d => this.setContext(d));
  }
  
  private setContext(context: Context | undefined) {
    this.selectedContext = context;
    if (context != undefined){
      this.mapService.getMapList(context).subscribe(data => this.mapList = data ?? [] );
    }
  }

  private setMap(map: MapSimple | undefined) {
    this.selectedMap = map;
  }

  onSelectMap(mapChange: string) {
    this.mapService.setSelectedMap(this.mapList.find(m => m.id === mapChange));
  }

  onClickMapType(event : Event ,type: MapType) {
    console.log('[NAV] Setting map type:', type);
    this.mapService.setMapType(type);
  }
}
