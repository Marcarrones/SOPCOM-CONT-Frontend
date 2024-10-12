import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContextService } from '../../../services/context.service';
import { Context } from '../../../models/context';
import { CriteriaListComponent } from '../criteria-list/criteria-list.component';
import { MapService } from '../../../services/map.service';
import { MapSimple, MapType } from '../../../models/map';
import { MatButton } from '@angular/material/button';
import { MethodChunkListComponent } from "../method-chunk-list/method-chunk-list.component";
import { MissingCard } from "../missing-card/missing-card.component";

@Component({
  selector: 'app-navigator',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    CriteriaListComponent,
    FormsModule,
    MatButton,
    MethodChunkListComponent,
    MissingCard
],
  templateUrl: './navigator.component.html',
  styleUrl: './navigator.component.css'
})
export class NavigatorComponent {
  @Input() maxHeight!: number;
  mapTypes = MapType;
  public lastMapType: MapType = MapType.All;
  
  public selectedContext: Context | undefined = undefined;
  public selectedMap: MapSimple | undefined = undefined;

  public mapList: MapSimple[] = [];
  public mapSelect: FormGroup;
  
  constructor(
    private contextService: ContextService,
    private mapService: MapService,
  ) {
    this.mapSelect = new FormGroup({
      mapSelectControl: new FormControl('',[])
    });
    this.mapService.selectedMap.subscribe(m => this.setMap(m?.asMapSimple()));
    this.mapService.mapType.subscribe(data => this.lastMapType = data);
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
    this.mapSelect.get('mapSelectControl')?.setValue(map?.id);
  }

  onSelectMap(mapChange: string) {
    this.mapService.setSelectedMap(this.mapList.find(m => m.id === mapChange));
  }

  onClickMapType(event : Event ,type: MapType) {
    this.mapService.setMapType(type);
  }
}
