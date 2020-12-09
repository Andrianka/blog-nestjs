import { UnauthorizedException } from '@nestjs/common';

class PostUnathorizedException extends UnauthorizedException {
  constructor(postTitle: string) {
    super(`You don't own this post - ${postTitle}`);
  }
}

export default PostUnathorizedException;
