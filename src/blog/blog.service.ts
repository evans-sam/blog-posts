import { Injectable } from '@nestjs/common';
import { BlogResponse } from './types';

@Injectable()
export class BlogService {
  async getTag(...tags: string[]): Promise<BlogResponse> {
    return {
      posts: [],
    };
  }
}
