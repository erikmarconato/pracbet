import { Routes } from '@angular/router';
import { InitialComponent } from './pages/initial-page/initial-page.component';
import { MatchDetailsPageComponent } from './pages/match-details-page/match-details-page.component';

export const routes: Routes = [
  { path: '', component: InitialComponent },
  { path: 'match-details/:id', component: MatchDetailsPageComponent },
];
