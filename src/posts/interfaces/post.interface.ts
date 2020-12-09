import { User } from 'src/users/user.entity';
import { Post } from '../post.entity';

export interface PostResponse {
  title: string;
  content: string;
  author: User;
}

export interface CommentResponse {
  title: string;
  content: string;
  author: User;
  comments?: Post[];
}
