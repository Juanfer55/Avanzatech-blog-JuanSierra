// angular
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// services
import { CommentsService } from '../../services/comments.service';
import { Comment } from '../../models/comments.model';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.sass'
})
export class CommentsComponent {

  @Input() postId!: Number;

  comments: Comment[] = [];
  totalComments = 0;


  constructor(
    private commentService: CommentsService
  ) {}

  ngOnInit() {
    this.getComments();
  }

  getComments() {
    return this.commentService.getComments(this.postId).subscribe({
      next: (response) => {
        this.totalComments = response.total_count
        this.comments = response.results
      }
    })
  }

}
