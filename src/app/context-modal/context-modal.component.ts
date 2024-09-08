import { Component, Input, input } from '@angular/core';
import { MaterialModule } from '../shared/material.module';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContextService } from '../../services/context.service';
import { ContextType } from '../../models/context-type';
import { Context } from '../../models/context';
import { Repository } from '../../models/repository';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EndpointService } from '../../services/endpoint.service';


@Component({
  selector: 'app-context-modal',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  templateUrl: './context-modal.component.html',
  styleUrl: './context-modal.component.css'
})
export class ContextModalComponent {
  // Option lists
  public contextTypes: ContextType[] = []; 
  public contextList: Context[] = [];
  public publicRepositories: Repository[] = [];

  
  public newContextForm: FormGroup;
  public selectContextForm: FormGroup;
  public updateContextForm: FormGroup;
  public selectedTabIndex: number = 0;
  
  public selectedContext: Context| undefined = undefined;
  modalTitle: string = 'Select Context';
  
  constructor( 
    public contextService: ContextService,
    public snackBar: MatSnackBar
  ) { 
    // NEW CONTEXT FORM
    this.newContextForm = new FormGroup({
      contextIdControl: new FormControl('', Validators.required),
      contextNameControl: new FormControl('', Validators.required),
      contextTypeSelect: new FormControl('', Validators.required),
      contextRepositorySelect: new FormControl('', Validators.required),
    });
    // SELECT CONTEXT FORM
    this.selectContextForm = new FormGroup({
      selectContextControl: new FormControl(),
    });
    // UPDATE CONTEXT FORM
    this.updateContextForm = new FormGroup({
      contextIdControl: new FormControl({value: this.selectedContext?.id, disabled: true}, Validators.required),
      contextNameControl: new FormControl(this.selectedContext?.name, Validators.required),
      contextTypeSelect: new FormControl(this.selectedContext?.type, Validators.required),
    });

    // Get info for selects
    // GET CONTEXTS
    this.contextService.getContexts().subscribe({
      next: data => { this.contextList = data },
      error: _ => this.openSnackBar('Error loading contexts')
    });
    // CONTEXT TYPES
    this.contextService.ContextTypes.subscribe(data => {this.contextTypes = data}); // then update when available
    // PUBLIC REPOSITORIES
    this.contextService.getPublicRepositories().subscribe({
      next: data => { this.publicRepositories = data ?? []; },
      error: _ => this.openSnackBar('Error loading repositories') 
    });  
    // Gets current context only once
    this.contextService.CurrentContext.subscribe(data => { this.setSelectedContext(data); });
  }

  public changeTab(tab: number) { 
    this.selectedTabIndex = tab;
    switch (tab) {
      case 0:
        this.modalTitle = 'Select Context';
        break;
      case 1:
        this.modalTitle = 'Update Context';
        break;
      case 2:
        this.modalTitle = 'Create Context';
        break;
      default:
      }
  }

// #region Select Context
  public compareWithContext(context : Context, value : Context) : boolean { return context?.id === value?.id; }

  public onSelectContext(contextId: string) : void { 
    var context = this.contextList.find(context => context.id === contextId); 
    // triggers subscribe event in constructor ->  setSelectedContext(data)
    this.contextService.setCurrentContext(context);
  }

  // Set selected context
  private setSelectedContext(context: Context | undefined) {
    //if(EndpointService.LOGGING) console.log("setSelectedContext(", context,")"); 
    this.selectedContext = context;
    this.selectContextForm.controls['selectContextControl'].setValue(context); 
    this.loadUpdateContextForm(context);
  }

  private loadUpdateContextForm(context: Context | undefined) {
    this.updateContextForm.controls['contextIdControl'].setValue(context?.id);
    this.updateContextForm.controls['contextNameControl'].setValue(context?.name);
    this.updateContextForm.controls['contextTypeSelect'].setValue(context?.type);
    this.selectContextForm.controls['selectContextControl'].setValue(context?.id);
  }
 //#endregion 

  public deleteSelectedContext() {
    if (this.selectedContext !== undefined){
      this.contextService.deleteContext(this.selectedContext).subscribe(d => this.onSelectContext(''));
    }
    else {
      this.openSnackBar("No context selected");
    }
  }

// #region Footer Buttons

 public onCancel() {
    this.selectedTabIndex = 0;
  }

  public onSubmit() {
    if (this.selectedTabIndex === 1) {
      //if(EndpointService.LOGGING) console.log('Update');
      this.contextService.updateContext(this.serializeContextForm(this.updateContextForm, this.selectedContext)).subscribe(
        _ => {
          this.contextService.getContexts();
        }
      );
    } else if (this.selectedTabIndex === 2) {
      //if(EndpointService.LOGGING) console.log('Create');
      this.contextService.createContext(this.serializeContextForm(this.newContextForm)).subscribe(
        _ => {
          this.contextService.getContexts().subscribe(_ => {
            // Updates service context list; updated list is sent through subscription
            this.onSelectContext(this.newContextForm.controls['contextIdControl']?.value);
            this.changeTab(0); // Change to select context tab
          }); 
        }
      );
    }
  }

//#endregion

// #region Helper Functions
  // Create context object from form, optionally using a fallback Context if form is incomplete (missing fields)
  private serializeContextForm(formGroup: FormGroup, fallback : Context | undefined = undefined): Context {
    var c = new Context(
      formGroup.controls['contextIdControl']?.value ?? fallback?.id,
      formGroup.controls['contextNameControl']?.value ?? fallback?.name,
      formGroup.controls['contextTypeSelect']?.value?? fallback?.type,
      formGroup.controls['contextRepositorySelect']?.value ?? fallback?.repository
    );
    //console.log('Serialized context: ', c);
    return c;
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', { duration: 2000 });
  }

  //#endregion
}
