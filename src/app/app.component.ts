import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MaterialModule } from './shared/material.module';
import { HeaderComponent } from './header/header.component';
import { RouterOutlet } from '@angular/router';
import { NavigatorComponent } from "./navigator/navigator.component";
import { Context } from '../models/context';
import { ContextService } from '../services/context.service';
import { HomeComponent } from "./home/home.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MaterialModule,
    HeaderComponent,
    RouterOutlet,
    NavigatorComponent,
    NavigatorComponent,
    HomeComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  {
  title = 'sopcom-cont';
  public selectedContext : Context | undefined = undefined;
  
  constructor(
    public contextService: ContextService,
  ) { 
    this.contextService.CurrentContext.subscribe(this.setContext);
  }

  private setContext(context: Context | undefined) {
    this.selectedContext = context;
  }
}
