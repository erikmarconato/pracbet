import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { NavegationbarComponent } from '../../components/navegationbar/navegationbar.component';
import { MatchDetailsComponent } from '../../components/match-details/match-details.component';

@Component({
  selector: 'app-match-details-page',
  imports: [HeaderComponent, NavegationbarComponent, MatchDetailsComponent,],
  templateUrl: './match-details-page.component.html',
  styleUrl: './match-details-page.component.css'
})
export class MatchDetailsPageComponent {

}
