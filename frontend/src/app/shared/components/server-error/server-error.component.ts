// angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSkullCrossbones } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLinkWithHref],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.sass'
})
export class ServerErrorComponent {

  errorIconc = faSkullCrossbones
}
