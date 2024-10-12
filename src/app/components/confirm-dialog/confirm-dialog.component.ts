import { Component } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogContent, MatDialogActions, MaterialModule],
  template: `
  <h1 mat-dialog-title>Confirm</h1>
  <mat-dialog-content [innerHTML]="confirmMessage"></mat-dialog-content>
  <mat-dialog-actions>
    <button mat-raised-button style="color: #fff;background-color: #153961;" (click)="dialogRef.close(true)">Confirm</button>
    <button mat-raised-button (click)="dialogRef.close(false)">Cancel</button>
  </mat-dialog-actions>`,
standalone: true,
})
export class ConfirmDialogComponent {
  
  public confirmMessage: string = "<p>Are you sure you want to perform this action?</p>";
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent, boolean>,
  ) { }
}
