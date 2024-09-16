import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Data, Edge, Network, Node } from "vis-network/peer/esm/vis-network";
import { DataSet } from "vis-data/peer/esm/vis-data";
import { MapService } from '../../services/map.service';
import { MapFull, MapType } from '../../models/map';
import { CanApply, MethodChunk } from '../../models/method-chunk';
import { MethodChunkService } from '../../services/method-chuck.service';
import { ContextService } from '../../services/context.service';
import { Context } from '../../models/context';

@Component({
  selector: 'app-map-graph',
  standalone: true,
  imports: [],
  templateUrl: './map-graph.component.html',
  styleUrl: './map-graph.component.css'
})
export class MapGraphComponent implements OnInit {
  @ViewChild("map", { static: true }) networkContainer!: ElementRef;

  public context: Context | undefined = undefined;

  public currentMap: MapFull | undefined = undefined;
  public currentType: MapType = MapType.CanApply;

  public selectedMethodChunks: MethodChunk[] = [];
  public canApplyMethodChunks: MethodChunk[] = [];

  public options = {
    physics: false,
      interaction: { hover: true, multiselect: false },
      manipulation: {
        enabled: false,
        addNode: (nodeData: any,callback: any) => { console.log("Add Node", nodeData, callback); },
        addEdge: (edgeData: any,callback: any) => { console.log("Add Edge", edgeData, callback); },   
      },
  }

  public networkGraph : Network | undefined;

  constructor(
    private mapService: MapService,
    private methodChunkService: MethodChunkService,
    private contextService: ContextService,
  ) { 
  }
  
  ngOnInit(): void {
    this.contextService.CurrentContext.subscribe(data => this.context = data);
    this.mapService.selectedMap.subscribe(data => this.changeMap(data)); 
    this.mapService.mapType.subscribe(data => this.changeMapType(data));
    this.methodChunkService.SelectedMethodChunks.subscribe(data => { 
      this.selectedMethodChunks = data; 
      this.buildNetworkGraph();
    });
    this.methodChunkService.CanApplyMethodChunks.subscribe(data => {
      this.canApplyMethodChunks = data.map((mcs: CanApply) => mcs.methodChunk.filter(mc => mc.canApply)).flat();
      this.buildNetworkGraph();
    });
  }

  changeMap(map: MapFull | undefined) {
    this.currentMap = map;
    if (this.context != undefined) {
      this.methodChunkService.getSelectedMethodChunks(this.context);
      this.methodChunkService.getCanApply(this.context);
    } else console.warn("[MAP] Undefined context", this.currentMap);

      this.buildNetworkGraph();
  }

  changeMapType(type: MapType) {
    this.currentType = type;
    this.buildNetworkGraph();
  }

  buildNetworkGraph() {
    var map = undefined;
    if (this.currentMap != undefined) {
      map = this.currentMap.clone();
      switch (this.currentType) {
        case MapType.CanApply:
          map.strategies.forEach(s => s.active = this.canApplyMethodChunks.some(mc => mc.strategy.id === s.id));
          break
        case MapType.Selected:
          map.strategies.forEach(s => s.active = this.selectedMethodChunks.some(mc => mc.strategy.id === s.id && mc.canApply));
          break;
        default:
          map.strategies.forEach(s => s.active = true);
      }
    }
    //console.log("[MAP] Building network graph with", this.currentType, map, this.canApplyMethodChunks, this.selectedMethodChunks);
    const data = this.buildNetworkData(map);
    this.networkGraph = new Network(this.networkContainer!.nativeElement, data, this.options);
  }

  private buildNetworkData(fullMap: MapFull | undefined) : Data {
    const nodes = new DataSet<Node>([]);
    const edges = new DataSet<Edge>([]);
    if (fullMap != undefined) {
      fullMap.goals.forEach(g => nodes.add(g.asNode()));
      fullMap.strategies.forEach(s => {
        nodes.add(s.asNode());
        edges.add(s.asEdge());
      });
    }
    return { nodes, edges };
  }

}