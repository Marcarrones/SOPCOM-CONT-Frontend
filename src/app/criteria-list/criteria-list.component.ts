import { Component } from '@angular/core';
import { Criteria, CriteriaValue } from '../../models/criteria';
import { CriteriaService } from '../../services/criteria.service';
import { Context } from '../../models/context';
import { ContextService } from '../../services/context.service';
import { MethodChunkService } from '../../services/method-chuck.service';
import { MapService } from '../../services/map.service';
import { MapType } from '../../models/map';

@Component({
  selector: 'app-criteria-list',
  standalone: true,
  imports: [],
  templateUrl: './criteria-list.component.html',
  styleUrl: './criteria-list.component.css'
})
export class CriteriaListComponent {
  public context: Context | undefined = undefined;

  public criteria: Criteria[] = [];
  public assignedCriteria: Criteria[] = [];

  constructor(
    private contextService: ContextService,
    private criteriaService: CriteriaService,
    private methodChunkService: MethodChunkService,
    private mapService: MapService,
  ) { 
    this.contextService.CurrentContext.subscribe(context => {
      this.context = context;
      if (this.context) {
        this.criteriaService.getContextCriteria(this.context!).subscribe(c => { this.criteria = c ?? []; });
        this.criteriaService.getAssignedContextCriteria(this.context!).subscribe(c => { this.assignedCriteria = c ?? []; });
      } else {
        this.criteria = [];
        this.assignedCriteria = [];
      }
    });
  }

  public checkAssigned(value : CriteriaValue): boolean {
    return this.assignedCriteria.some(c => c.values.some(v => v.id === value.id));
  }

  public toggleCriteria (event : Event, value : CriteriaValue) : void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.criteriaService.assignCriteriaValue(this.context!, value)
        .subscribe(_ => this.propagateCriteriaUpdate());
    } else if (value.assignedMC.length !== 0 || window.confirm("Selected criteria is assigned to selected method chunks. Do you want to unassign it?")) {
      this.criteriaService.removeCriteriaValue(this.context!, value)
        .subscribe(_ => this.propagateCriteriaUpdate());
    }
    else { // if the user cancels the unassignment
      (event.target as HTMLInputElement).checked = true;
    }

    this.mapService.setMapType(MapType.CanApply);
  }

  propagateCriteriaUpdate(){
    this.methodChunkService.getCanApply(this.context!);
    this.methodChunkService.getSelectedMethodChunks(this.context!);
  }
}
