import { map, Observable, ReplaySubject } from "rxjs";
import { Context } from "../models/context";
import { CanApply, MethodChunk } from "../models/method-chunk";
import { EndpointService } from "./endpoint.service";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class MethodChunkService {
    private selectedMethodChunksSubject: ReplaySubject<MethodChunk[]> = new ReplaySubject<MethodChunk[]>(1);
    public SelectedMethodChunks : Observable<MethodChunk[]> = this.selectedMethodChunksSubject.asObservable();

    private canApplySubject: ReplaySubject<CanApply[]> = new ReplaySubject<CanApply[]>(1);
    public CanApplyMethodChunks : Observable<CanApply[]> = this.canApplySubject.asObservable()

    constructor(
        private endpointService: EndpointService,
    ) { }
    // [GET] index.php/context/:id/canApply
    public getCanApply(context: Context): Observable<CanApply[]> {
        this.endpointService.get<any>(`context/${context.id}/canApply`)
            .pipe(map(data => data.map(CanApply.fromJson))).subscribe(data => this.canApplySubject.next(data));
        return this.CanApplyMethodChunks;
    }
    // [GET] index.php/context/:id/selectedMethodChunks
    public getSelectedMethodChunks(context: Context): Observable<MethodChunk[]> {
        this.endpointService.get<any>(`context/${context.id}/selectedMethodChunks`)
            .pipe(map(data =>data.map(MethodChunk.fromJson))).subscribe(data => this.selectedMethodChunksSubject.next(data));
        return this.SelectedMethodChunks;
    }
    // [POST] index.php/context/:id/selectedMethodChunks
    public addSelectedMethodChunk(context: Context, methodChunk: MethodChunk): Observable<any> {
        return this.endpointService.post(`context/${context.id}/selectedMethodChunks`, { id: methodChunk.id });
    }
    // [DELETE] index.php/context/:id/selectedMethodChunks/:methodChunkId
    public removeSelectedMethodChunk(context: Context, methodChunk: MethodChunk): Observable<any> {
        return this.endpointService.delete(`context/${context.id}/selectedMethodChunks/${methodChunk.id}`);
    }
    public updateSelectedMethodChunksList(selectedMethodChunks: MethodChunk[]): void {
        this.selectedMethodChunksSubject.next([...selectedMethodChunks]);
    }
}