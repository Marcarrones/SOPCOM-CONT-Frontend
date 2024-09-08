import { Component } from '@angular/core';
import { MethodChunkService } from '../../services/method-chuck.service';
import { ContextService } from '../../services/context.service';
import { Context } from '../../models/context';
import { CanApply, MethodChunk } from '../../models/method-chunk';
import { CommonModule } from '@angular/common';
import { MapSimple } from '../../models/map';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-method-chunk-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './method-chunk-list.component.html',
  styleUrl: './method-chunk-list.component.css'
})
export class MethodChunkListComponent {
  public context: Context | undefined = undefined;

  public strategies: CanApply[] = [];
  public filteredStrategies: CanApply[] = [];
  public selectedMethodChunks: MethodChunk[] = [];

  constructor(
    private contextService: ContextService,
    private methodChunkService: MethodChunkService,
    private mapService: MapService
  ) { 
    this.contextService.CurrentContext.subscribe(context => { this.updateContext(context) })
    this.mapService.selectedMap.subscribe(map => { this.updateSelectedMap(map) });
  }
  
  public updateContext(context : Context | undefined) {
    this.context = context;
    if (context == undefined) {
      this.strategies = [];
    } else {
      this.methodChunkService.getCanApply(context).subscribe(data => this.strategies = data);
      this.methodChunkService.getSelectedMethodChunks(context).subscribe(data => this.selectedMethodChunks = data);
    }
  }

  public updateSelectedMap(selectedMap: MapSimple | undefined) {
    this.filteredStrategies = this.strategies.filter(s => selectedMap == undefined || s.methodChunk.some(mc => mc.goal.map == selectedMap?.id));
  }

  checkMethodChunkSelected(methodChunk: MethodChunk): boolean{
    return this.selectedMethodChunks.some(c => c.id === methodChunk.id);
  }

  toggleMethodChunk(event: Event, methodChunk: MethodChunk) {
    const checked = (event.target as HTMLInputElement).checked;
    console.log('Toggling method chunk:', methodChunk, checked);
    if (checked) {
      this.selectedMethodChunks.push(methodChunk);
      this.methodChunkService.setSelectedMethodChunk(this.context!, methodChunk);
    } else {
      this.selectedMethodChunks = this.selectedMethodChunks.filter(c => c.id !== methodChunk.id);
      this.methodChunkService.removeSelectedMethodChunk(this.context!, methodChunk);
    }
  }  
}
