import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { NavegationbarComponent } from '../../components/navegationbar/navegationbar.component';
import { ContentComponent } from '../../components/content/content.component';

@Component({
  selector: 'app-initial',
  imports: [HeaderComponent, NavegationbarComponent, ContentComponent,],
  templateUrl: './initial-page.component.html',
  styleUrl: './initial-page.component.css'
})
export class InitialComponent {

}
