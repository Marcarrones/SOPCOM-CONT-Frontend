import { Component } from '@angular/core';
import { Criteria, CriteriaValue } from '../../../models/criteria';
import { CriteriaService } from '../../../services/criteria.service';
import { Context } from '../../../models/context';
import { ContextService } from '../../../services/context.service';
import { MethodChunkService } from '../../../services/method-chuck.service';
import { MapService } from '../../../services/map.service';
import { MapType } from '../../../models/map';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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
    private dialog: MatDialog,
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
  // Returns list of method chunk ids that have only been assigned to this value
  public getUniqueAssignedMethodChunksId(value: CriteriaValue): string[] {
    var allAssignedMC = this.assignedCriteria.flatMap(c =>c.values.filter(v => v.id != value.id).flatMap(v =>v.assignedMC)); 
    console.log("All other assignedMC", allAssignedMC);
    console.log("All assignedMc not included", value.assignedMC.filter(mc => !allAssignedMC.includes(mc)));
    return value.assignedMC.filter(mc => !allAssignedMC.includes(mc));
  
  }

  public toggleCriteria (event : Event, value : CriteriaValue) : void {
    const checked = (event.target as HTMLInputElement).checked;
    var uniqueMC = this.getUniqueAssignedMethodChunksId(value);
    if (checked) {
      this.criteriaService.assignCriteriaValue(this.context!, value)
        .subscribe(_ => this.propagateCriteriaUpdate());
    } else if (uniqueMC.length == 0) {
      this.criteriaService.removeCriteriaValue(this.context!, value) // remove criteria-value
        .subscribe(_ => this.propagateCriteriaUpdate());
    } else  {
      var confirmDialog = this.dialog.open(ConfirmDialogComponent, {});
      confirmDialog.componentInstance.confirmMessage = `<p>This criteria value is assigned to the following selected method chunks.<p><ul>`;
      uniqueMC.forEach(mcId => { confirmDialog.componentInstance.confirmMessage += `\n<li>${mcId}</li>`; });
      confirmDialog.componentInstance.confirmMessage += `</ul><p>Are you sure you want to unassign it?</p>`;
      confirmDialog.afterClosed().subscribe(result => {
        if (result) {
          this.criteriaService.removeCriteriaValue(this.context!, value) // remove criteria-value
            .subscribe(_ => this.propagateCriteriaUpdate());
        } else { // if the user cancels the unassignment
          (event.target as HTMLInputElement).checked = true;
        }
      });
    }

    this.mapService.setMapType(MapType.CanApply);
  }

  propagateCriteriaUpdate(){
    this.methodChunkService.getCanApply(this.context!);
    this.methodChunkService.getSelectedMethodChunks(this.context!);
  }
}
