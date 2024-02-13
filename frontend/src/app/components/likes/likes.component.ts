// angular
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// services
import { LikesService } from '../../services/likes.service';
import { Like } from '../../models/like.model';

@Component({
  selector: 'app-likes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './likes.component.html',
  styleUrl: './likes.component.sass'
})
export class LikesComponent {

  likes: Like[] = [];
  totalLikes = 0;

  @Input() postId!: Number;

  constructor(
    private likeService: LikesService,
  ) {}

  ngOnInit() {
    this.getLikes();
  }

  getLikes() {
    return this.likeService.getPostLikes(this.postId).subscribe({
      next: (response) => {
        this.likes = response.results
        this.totalLikes = response.total_count
      }
    });
  }

}
