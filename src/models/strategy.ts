import { Edge, Node } from "vis-network/declarations/entry-esnext";

export class Strategy  {
    constructor (
        public id: string,
        public name: string,
        public x: number,
        public y: number,
        public goal_tgt: string,
        public goal_src: string,
        public active: boolean = true,
    ) { }
    
    
    static fromJson(json: any): Strategy {
        return new Strategy (json.id, json.name, json.x, json.y, json.goal_tgt,  json.goal_src);
    }
    
    public asNode() : Node {
        return { id: `${this.id}`, label: this.name, x: this.x, y: this.y, 
            color: "white",  
            font: { color: (this.active ?  'black' : 'gray') },
            shape: 'box',
        };
    }

    // Strategy returns edges g_src -> s -> g_tgt
    public asEdge() : Edge[] {
        return [ this.buildEdge(`${this.goal_src}`, `${this.id}`), this.buildEdge(`${this.id}`, `${this.goal_tgt}`) ];
    }

    private buildEdge(src: string, tgt: string) : Edge {
        return { from: src, to: tgt, arrows: 'middle', color: (this.active ? "#2B7CE9" : 'lightgray' ), smooth: { enabled: true, type: 'cubicBezier', roundness: 0.5 } }
    }

    clone(id = this.id, name = this.name, x = this.x, y = this.y, goal_tgt = this.goal_tgt, goal_src = this.goal_src, active = this.active): Strategy {
        return new Strategy(id, name, x, y, goal_tgt, goal_src, active);
    }
}