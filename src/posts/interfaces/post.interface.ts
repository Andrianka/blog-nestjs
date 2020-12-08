import { User } from 'src/users/user.entity';

export interface PostResponse {
  title: string;
  content: string;
  author: User;
}
