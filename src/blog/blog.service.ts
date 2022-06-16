import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { BlogResponse, HATCHWAYS_API, Post } from './types';
import { HttpService } from '@nestjs/axios';
import { flatten, uniqBy } from 'lodash';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BlogService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getPosts(...tags: string[]): Promise<BlogResponse> {
    const responses: Post[][] = await Promise.all(
      tags.map(async (tag) => {
        let posts = await this.getCachedPosts(tag);
        if (!posts) posts = await this.getBlogPosts(tag);

        return posts;
      }),
    );

    return {
      posts: uniqBy(flatten(responses), (post) => post.id),
    };
  }

  private async getBlogPosts(tag: string) {
    let posts: Post[];
    try {
      const endPoint = HATCHWAYS_API + `?tag=${tag}`;
      const responseData = await firstValueFrom(
        await this.httpService.get<BlogResponse>(endPoint, {
          timeout: 5000,
        }),
      );
      posts = responseData.data.posts;
      return posts;
    } catch (e: any) {
      throw e;
    } finally {
      // noinspection ES6MissingAwait
      this.cacheManager.set(tag, posts, { ttl: 60 * 5 });
    }
  }

  private async getCachedPosts(tag: string): Promise<Post[]> {
    return (await this.cacheManager.get(tag)) as Post[];
  }
}
