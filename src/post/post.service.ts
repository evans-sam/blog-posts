import { Injectable } from '@nestjs/common';
import { BlogService } from '../blog/blog.service';
import { Post, SortBy, SortDirection } from '../blog/types';

@Injectable()
export class PostService {
  constructor(private readonly blogService: BlogService) {}

  async getPosts({
    direction = SortDirection.asc,
    sortBy = SortBy.id,
    tags,
  }: {
    direction?: SortDirection;
    sortBy?: keyof Pick<Post, SortBy>;
    tags: string[];
  }) {
    const sortDirectionMap: Record<SortDirection, (a, b) => number> = {
      [SortDirection.asc]: (a, b) => a[sortBy] - b[sortBy],
      [SortDirection.desc]: (a, b) => b[sortBy] - a[sortBy],
    };
    const sortCallback = (a, b) => sortDirectionMap[direction](a, b);

    const data = await this.blogService.getPosts(...tags);
    data.posts.sort(sortCallback);
    return data;
  }
}
