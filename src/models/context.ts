import { Repository } from "./repository";

export class Context {
    public id: string;
    public name: string;
    public type: number;
    public repository: Repository;

    constructor(id: string, name: string, type: number, repository: Repository) {
        this.id = id
        this.name = name
        this.type = type
        this.repository = repository
    }

    public toString = () : string => {
        return `(${this.id}) ${this.name}`;
    }

    static fromJson(json: any): Context { 
        return new Context(json.id, json.name, json.type, Repository.fromJson(json.repository));
    }
}
