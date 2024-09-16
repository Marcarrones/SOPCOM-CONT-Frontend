import { Component, Input } from '@angular/core';
import { MaterialModule } from '../shared/material.module';

@Component({
  selector: 'app-missing-card',
  standalone: true,
  imports: [
    MaterialModule
  ],
  template:`
    <mat-card>
      <mat-card-header>
        <mat-card-title> {{text}}</mat-card-title>
        <mat-card-subtitle> {{subText}} </mat-card-subtitle>
      </mat-card-header>
    </mat-card>
  `,
})
export class MissingCard { 
  @Input() text: string = "No context selected";
  @Input() subText: string = "No context selected";
}
