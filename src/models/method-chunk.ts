import { Goal } from "./goal";
import { Strategy } from "./strategy";

export class MethodChunk {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public activity: string,
        public goal: Goal,
        public strategy: Strategy,
        public repository_id: string,
        public canApply: boolean = false,
    ) { }

    public static fromJson(data: any): MethodChunk {
        return new MethodChunk(
            data.id,
            data.name,
            data.description,
            data.activity,
            Goal.fromJson(data.goal),
            Strategy.fromJson(data.strategy),
            data.repository_id,
            data.canApply === 'YES',
        );
    }
}

export class CanApply {
    constructor(
        public strategy: Strategy,
        public methodChunk: MethodChunk[],
    ) { }

    public static fromJson(data: any) {
        return new CanApply(Strategy.fromJson(JSON.parse(data.strategy)), JSON.parse(data.methodChunks).map(MethodChunk.fromJson));
    }
}


