import { map, Observable } from "rxjs";
import { Context } from "../models/context";
import { CanApply, MethodChunk } from "../models/method-chunk";
import { EndpointService } from "./endpoint.service";
import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class MethodChunkService {

    constructor(
        private endpointService: EndpointService
    ) { }

    public getCanApply(context: Context): Observable<CanApply[]> {
        return this.endpointService.get<any>(`context/${context.id}/canApply`).pipe(map(data => data.map(CanApply.fromJson)));
    }

    public getSelectedMethodChunks(context: Context): Observable<MethodChunk[]> {
        return this.endpointService.get<any>(`context/${context.id}/selectedMethodChunks`).pipe(map(data => data?.map(MethodChunk.fromJson) ?? []));
    }

    public setSelectedMethodChunk(context: Context, methodChunk: MethodChunk): Observable<any> {
        return this.endpointService.post(`context/${context.id}/selectedMethodChunks`, { id: methodChunk.id });
    }

    public removeSelectedMethodChunk(context: Context, methodChunk: MethodChunk): Observable<any> {
        return this.endpointService.delete(`context/${context.id}/selectedMethodChunks/${methodChunk.id}`);
    }
}