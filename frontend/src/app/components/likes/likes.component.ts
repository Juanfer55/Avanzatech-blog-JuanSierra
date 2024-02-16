// angular
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// services
import { Like } from '../../models/like.model';

@Component({
  selector: 'app-likes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './likes.component.html',
  styleUrl: './likes.component.sass'
})
export class LikesComponent {

  @Input() likes: Like[] = [];

}
