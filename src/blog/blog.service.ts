import { HttpException, Injectable } from '@nestjs/common';
import { BlogResponse, HATCHWAYS_API, Post } from './types';
import { HttpService } from '@nestjs/axios';
import { flatten, uniqBy } from 'lodash';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BlogService {
  constructor(private readonly httpService: HttpService) {}

  async getPosts(...tags: string[]): Promise<BlogResponse> {
    if (!tags || !tags.length)
      throw new HttpException('Tags parameter is required', 400);

    const endPoints = tags.map((tag) => HATCHWAYS_API + `?tag=${tag}`);

    const responses: Post[][] = await Promise.all(
      endPoints.map(async (endPoint) => {
        const responseData = await firstValueFrom(
          await this.httpService.get<BlogResponse>(endPoint, {
            timeout: 5000,
          }),
        );
        return responseData.data.posts;
      }),
    );

    return {
      posts: uniqBy(flatten(responses), (post) => post.id),
    };
  }
}
