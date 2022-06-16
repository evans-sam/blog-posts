import { Injectable } from '@nestjs/common';
import { BlogService } from '../blog/blog.service';

@Injectable()
export class PostService {
  constructor(private readonly blogService: BlogService) {}

  async getPosts({ direction, sortBy, tags }) {
    const data = await this.blogService.getPosts(...tags);

    const sortCallback = (a, b) =>
      direction === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];

    data.posts.sort(sortCallback);
    return data;
  }
}
