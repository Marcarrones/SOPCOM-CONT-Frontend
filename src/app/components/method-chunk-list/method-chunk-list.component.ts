import { Component } from '@angular/core';
import { MethodChunkService } from '../../../services/method-chuck.service';
import { ContextService } from '../../../services/context.service';
import { Context } from '../../../models/context';
import { CanApply, MethodChunk } from '../../../models/method-chunk';
import { CommonModule } from '@angular/common';
import { MapSimple, MapType } from '../../../models/map';
import { MapService } from '../../../services/map.service';
import { MissingCard } from "../missing-card/missing-card.component";

@Component({
  selector: 'app-method-chunk-list',
  standalone: true,
  imports: [
    CommonModule,
    MissingCard
],
  templateUrl: './method-chunk-list.component.html',
  styleUrl: './method-chunk-list.component.css'
})
export class MethodChunkListComponent {
  public context: Context | undefined = undefined;
  public selectedMap: MapSimple | undefined = undefined;

  private strategies: CanApply[] = [];
  private selectedMethodChunks: MethodChunk[] = [];
  public filteredStrategies: CanApply[] = [];

  constructor(
    private contextService: ContextService,
    private methodChunkService: MethodChunkService,
    private mapService: MapService
  ) { 
    this.contextService.CurrentContext.subscribe(context => { this.updateContext(context) });
    this.mapService.selectedMap.subscribe(map => { this.updateSelectedMap(map) });
    this.methodChunkService.CanApplyMethodChunks.subscribe(data => { 
      this.strategies = data; 
      this.updateSelectedMap(this.selectedMap); 
    });
    this.methodChunkService.SelectedMethodChunks.subscribe(data =>{ 
      this.selectedMethodChunks = data;
      this.updateSelectedMap(this.selectedMap); 
    });
  }
  
  public updateContext(context : Context | undefined) {
    this.context = context;
    if (context != undefined) {
      this.methodChunkService.getCanApply(context); // updated un constructor subscribe
      this.methodChunkService.getSelectedMethodChunks(context); // updated un constructor subscribe
    }
  }

  public updateSelectedMap(selectedMap: MapSimple | undefined) {
    this.selectedMap = selectedMap;
    this.filteredStrategies = this.strategies.filter(s => selectedMap != undefined && s.methodChunk.some(mc => mc.goal.map == selectedMap?.id));
  }

  checkMethodChunkSelected(methodChunk: MethodChunk): boolean{
    return this.selectedMethodChunks.some(c => c.id === methodChunk.id);
  }

  toggleMethodChunk(event: Event, methodChunk: MethodChunk) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedMethodChunks.push(methodChunk);
      this.methodChunkService.addSelectedMethodChunk(this.context!, methodChunk);
    } else {
      this.selectedMethodChunks = this.selectedMethodChunks.filter(c => c.id !== methodChunk.id);
      this.methodChunkService.removeSelectedMethodChunk(this.context!, methodChunk);
    }
    // Update service method chunk list
    this.methodChunkService.updateSelectedMethodChunksList(this.selectedMethodChunks);
    this.mapService.setMapType(MapType.Selected); // Set map type to selected
  }  
}
