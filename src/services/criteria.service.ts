import { Injectable } from '@angular/core';
import { EndpointService } from './endpoint.service';
import { Context } from '../models/context';
import { Criteria, CriteriaValue } from '../models/criteria';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CriteriaService {
    constructor(
        private endpointService: EndpointService,
    ) { }

    public getContextCriteria(context: Context) : Observable<Criteria[] | undefined> {
        return this.endpointService.get<any>(`context/${context.id}/criterion`).pipe(map(data => data.map(Criteria.fromJson)));
    }
    
    public getAssignedContextCriteria(context: Context) : Observable<Criteria[] | undefined> {
        return this.endpointService.get<any>(`context/${context.id}/assignedCriterion`).pipe(map(data => data.map(Criteria.fromJson)));  
    }

    public assignCriteriaValue(context: Context, value: CriteriaValue) : Observable<any> {
        return this.endpointService.post('context/'+context.id+'/criterion/'+value.criteriaId, { value: value.id });
    }

    public removeCriteriaValue(context: Context, value: CriteriaValue) : Observable<any> {
        return this.endpointService.delete(`context/${context.id}/criterion/${value.criteriaId}/${value.id}`);
    }
    
}
