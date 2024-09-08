import { Injectable } from '@angular/core';
import { EndpointService } from './endpoint.service';
import { Context } from '../models/context';
import { BehaviorSubject, catchError, Observable, of, ReplaySubject } from 'rxjs';
import { ContextType } from '../models/context-type';
import { Repository } from '../models/repository';

@Injectable({
    providedIn: 'root'
})
export class ContextService {
    private contextListSubject: ReplaySubject<Context[]> = new ReplaySubject<Context[]>(1);
    public Contexts : Observable<Context[]> = this.contextListSubject.asObservable();

    private contextTypesSubject: ReplaySubject<ContextType[]> = new ReplaySubject<ContextType[]>(1);
    public ContextTypes: Observable<ContextType[]> = this.contextTypesSubject.asObservable();

    private contextSubject: BehaviorSubject<Context|undefined> = new BehaviorSubject<Context|undefined>(undefined);
    public CurrentContext: Observable<Context|undefined> = this.contextSubject.asObservable();

    constructor(
        public endpointService: EndpointService
    ) { 
        this.getContextTypes();
    }
    
    public getContextTypes() : Observable<ContextType[]> {
        this.endpointService.get<ContextType[]>('context/types').subscribe({
            next: data => {
                this.contextTypesSubject.next(data ?? []);
            },
            error: _ => { catchError(e => of([]) ); }
        });
        return this.ContextTypes;
    }
    
    public setCurrentContext(context: Context | undefined) : void {
        console.log('Setting current context to:', context);
        this.contextSubject.next(context);
    }

    public getContexts() : Observable<Context[]>  {
        this.endpointService.get<Context[]>('context').subscribe({
            next: data => {
                this.contextListSubject.next(data ?? []);
            }, 
            error: _ => { catchError(e => of([]) ); }
        });
        return this.Contexts;
    }

    public getPublicRepositories() : Observable<Repository[] | undefined> {
        return this.endpointService.get<Repository[]>('repository/public');
    }

    public getRepository(id: string) : Observable<Repository | undefined> {
        return this.endpointService.get<Repository>('repository/' + id);
    }

    public createContext(context: Context) : Observable<any | undefined> {
        return this.endpointService.post('context', context);
    }

    public updateContext(context: Context) : Observable<Context | undefined> {
        return this.endpointService.put<Context>('context/' + context.id, context);
    }

    public deleteContext(context: Context) : Observable<boolean> {
        return this.endpointService.delete('context/' + context.id);
    }



}