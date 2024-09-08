import { Goal } from "./goal";
import { Strategy } from "./strategy";

export class MapSimple {
    constructor(
        public id: string,
        public name: string,
    ) { }

    public static fromJson(data: any): MapSimple {
        return new MapSimple(data.id, data.name);
    }
}

export class MapFull {
    constructor(
        public id: string,
        public name: string,
        public repository: string,
        public strategies: Strategy[],
        public goals: Goal[],
    ) { }

    public static fromJson(data: any): MapFull {
        return new MapFull(data.id, data.name, data.repository, JSON.parse(data.strategies).map(Strategy.fromJson), JSON.parse(data.goals).map(Goal.fromJson));
    }

    public asMapSimple() : MapSimple { return new MapSimple(this.id, this.name); }
}

export enum MapType {
    All,
    CanApply,
    Selected
}