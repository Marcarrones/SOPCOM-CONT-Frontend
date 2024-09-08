
export class Repository {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public status: RepositoryStatus,
    ) { }
    
    static fromJson(json: any): Repository {
        return new Repository(json.id, json.name, json.description, RepositoryStatus.fromJson(json.status));
    }
}

export class RepositoryStatus {
    constructor(
        public id: number,
        public name: string
    ) {}

    static fromJson(json: any): RepositoryStatus {
        return new RepositoryStatus(json.id, json.name);
    }
     
}