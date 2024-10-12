import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContextModalComponent } from '../context-modal/context-modal.component';
import { MaterialModule } from '../../shared/material.module';
import { EndpointService } from '../../../services/endpoint.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MaterialModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  sopcomRepUrl: string = EndpointService.SERVER_URL + EndpointService.REP_PORT;

  constructor(
    private contextDialog: MatDialog
  )
  { }

  // Opens the select/create context dialog
  public openContextDialog() {
    this.contextDialog.open(ContextModalComponent, {
      width: "75%",
    });
  }
}
