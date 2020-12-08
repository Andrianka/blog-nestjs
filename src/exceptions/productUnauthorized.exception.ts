import { UnauthorizedException } from '@nestjs/common';

class ProductUnathorizedException extends UnauthorizedException {
  constructor(productTitle: string) {
    super(`You don't own this post - ${productTitle}`);
  }
}

export default ProductUnathorizedException;
