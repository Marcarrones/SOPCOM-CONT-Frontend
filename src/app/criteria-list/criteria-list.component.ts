import { Component, input, Input, SimpleChanges } from '@angular/core';
import { Criteria, CriteriaValue } from '../../models/criteria';
import { CriteriaService } from '../../services/criteria.service';
import { Context } from '../../models/context';
import { ContextService } from '../../services/context.service';

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
    private criteriaService: CriteriaService,
    private contextService: ContextService,
  ) { 
    this.contextService.CurrentContext.subscribe(context => {
      this.context = context;
      this.loadCriteria();
    });
  }

  public loadCriteria() {
    if (this.context) {
      this.criteriaService.getContextCriteria(this.context!).subscribe(c => { this.criteria = c ?? [];
        //console.log('Criteria:',this.context?.id, this.criteria);
      });
      this.criteriaService.getAssignedContextCriteria(this.context!).subscribe(c => { this.assignedCriteria = c ?? [];
        //console.log('AssignedCriteria:',this.context?.id, this.assignedCriteria);
      });
    } else {
      //console.error('No context provided to CriteriaListComponent');
      this.criteria = [];
      this.assignedCriteria = [];
    }
  }

  public checkAssigned(value : CriteriaValue): boolean {
    return this.assignedCriteria.some(c => c.values.some(v => v.id === value.id));
  }

  public toggleCriteria (event : Event, value : CriteriaValue) : void {
    const checked = (event.target as HTMLInputElement).checked;
    console.log("[CRITERIA] Toggling criteria", value, checked);
    if (checked) {
      this.criteriaService.assignCriteriaValue(this.context!, value);
    } else {
      this.criteriaService.removeCriteriaValue(this.context!, value);
    }
  }
}
