// angular
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// models
import { PostWithExcerpt } from '../../models/post.model';
// components
import { LikesComponent } from '../likes/likes.component';
import { CommentsComponent } from '../comments/comments.component';
import { User } from '../../models/user.model';
import { LikePostComponent } from '../like-post/like-post.component';
// services
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-listpost',
  standalone: true,
  imports: [CommonModule, LikesComponent, CommentsComponent, LikePostComponent],
  templateUrl: './listpost.component.html',
  styleUrl: './listpost.component.sass',
})
export class ListpostComponent {
  user: User | null = null;
  isLogIN: boolean = false;

  @Input() post!: PostWithExcerpt;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.userProfile$.subscribe((userProfile) => {
      if (userProfile) {
        this.user = userProfile;
        this.isLogIN = true;
      }
    });
  }
}
