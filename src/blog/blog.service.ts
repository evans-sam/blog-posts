import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
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
      tags.map(
        async (tag) =>
          (await this.getCachedPosts(tag)) ?? (await this.getBlogPosts(tag)),
      ),
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
      this.cacheManager
        .set(tag, posts, { ttl: 60 * 5 })
        .then(() => Logger.log(`Cache added tag ${tag}`));
    }
  }

  private async getCachedPosts(tag: string): Promise<Post[]> {
    const posts = await this.cacheManager.get(tag);
    Logger.log(`Cache ${!!posts ? 'hit' : 'miss'} for tag ${tag}`);
    return posts as Post[];
  }
}
