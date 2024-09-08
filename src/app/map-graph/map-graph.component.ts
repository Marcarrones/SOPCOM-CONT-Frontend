import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Data, Edge, Network, Node } from "vis-network/peer/esm/vis-network";
import { DataSet } from "vis-data/peer/esm/vis-data";
import { MapService } from '../../services/map.service';
import { MapFull, MapType } from '../../models/map';
import { MethodChunk } from '../../models/method-chunk';
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
  }

  changeMap(map: MapFull | undefined) {
    this.currentMap = map;
    if (this.context != undefined) {
      this.methodChunkService.getSelectedMethodChunks(this.context!).subscribe(data => this.selectedMethodChunks = data);
      this.methodChunkService.getCanApply(this.context!).subscribe(data => this.canApplyMethodChunks = data.map(mcs => mcs.methodChunk.filter(mc => mc.canApply)).flat());
    } else console.warn("[MAP] Undefined context", this.currentMap);

      this.buildNetworkGraph();
  }

  changeMapType(type: MapType) {
    this.currentType = type;
    console.log("[MAP] Changing map type to", type.toString());
    this.buildNetworkGraph();
  }

  buildNetworkGraph() {
    var map = undefined;
    if (this.currentMap != undefined) {
      switch (this.currentType) {
        case MapType.All:
          map = this.currentMap;
          break;
        case MapType.CanApply:
          map = new MapFull(this.currentMap!.id, this.currentMap!.name,this.currentMap!.repository , this.currentMap!.strategies.filter(s => this.canApplyMethodChunks.some(mc => mc.strategy.id === s.id)), this.currentMap!.goals.filter(g => this.canApplyMethodChunks.some(mc => mc.goal.id === g.id)));
          break
        case MapType.Selected:
          map = new MapFull(this.currentMap!.id, this.currentMap!.name,this.currentMap!.repository , this.currentMap!.strategies.filter(s => this.selectedMethodChunks.some(mc => mc.strategy.id === s.id)), this.currentMap!.goals.filter(g => this.selectedMethodChunks.some(mc => mc.goal.id === g.id)));
          break;
      }
    }
    console.log("[MAP] Building network graph with", this.currentType.toString(), map);
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