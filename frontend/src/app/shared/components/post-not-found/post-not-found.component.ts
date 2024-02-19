// angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFaceGrinBeamSweat } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-post-not-found',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './post-not-found.component.html',
  styleUrl: './post-not-found.component.sass'
})
export class PostNotFoundComponent {

  notFoundIcon = faFaceGrinBeamSweat;

}
