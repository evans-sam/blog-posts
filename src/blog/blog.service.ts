import { Injectable } from '@nestjs/common';
import { BlogResponse, Post } from './types';
import { HATCHWAYS_API } from './blog.module';
import { HttpService } from '@nestjs/axios';
import { flatten, uniqBy } from 'lodash';

@Injectable()
export class BlogService {
  constructor(private readonly httpService: HttpService) {}

  async getPosts(...tags: string[]): Promise<BlogResponse> {
    const endPoints = tags.map((tag) => HATCHWAYS_API + `?tag=${tag}`);

    const responses: Post[][] = await Promise.all(
      endPoints.map(
        async (endPoint) =>
          (
            await this.httpService
              .get<BlogResponse>(endPoint, { timeout: 5000 })
              .toPromise()
          ).data.posts,
      ),
    );

    return {
      posts: uniqBy(flatten(responses), (post) => post.id),
    };
  }
}
