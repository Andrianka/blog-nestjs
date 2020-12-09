import { NotFoundException } from '@nestjs/common';

class PostNotFoundException extends NotFoundException {
  constructor(postId: string) {
    super(`Post - ${postId} not found`);
  }
}

export default PostNotFoundException;
