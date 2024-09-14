import { Repository } from "./repository";

export class Context {
    public id: string;
    public name: string;
    public context_type: number;
    public repository: string;

    constructor(id: string, name: string, type: number, repository: string) {
        this.id = id
        this.name = name
        this.context_type = type
        this.repository = repository
    }

    public toString = () : string => {
        return `(${this.id}) ${this.name}`;
    }

    static fromJson(json: any): Context { 
        return new Context(json.id, json.name, json.context_type, json.repository);
    }
}
