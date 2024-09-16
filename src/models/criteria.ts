import { Repository } from "./repository";

export class Criteria {
constructor(
    public id: number,
    public name: string,
    public repository: Repository,
    public values: CriteriaValue[],
    ) { }

    public static fromJson(data: any) : Criteria {
        return new Criteria(data.id, data.name, data.repository, JSON.parse(data.values).map((v: any) => new CriteriaValue(v.id, v.name, v.criteriaId, JSON.parse(v.assignedMC))));
    }
    
    public toString = () : string => {
        return `(${this.id}) ${this.name}`;
    }
}

export class CriteriaValue {
    constructor(
        public id: number,
        public name: string,
        public criteriaId: number,
        public assignedMC: string[],
    ) { }
}
