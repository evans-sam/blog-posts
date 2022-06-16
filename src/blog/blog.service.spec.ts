import { Test, TestingModule } from '@nestjs/testing';
import { BlogService } from './blog.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('BlogService', () => {
  let service: BlogService;
  const httpService = {
    get: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogService, HttpService],
    })
      .overrideProvider(HttpService)
      .useValue(httpService)
      .compile();

    service = module.get<BlogService>(BlogService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const techBlog = {
    id: 1,
    author: 'Rylee Paul',
    authorId: 9,
    likes: 960,
    popularity: 0.13,
    reads: 50361,
    tags: ['tech', 'health'],
  };

  const historyBlog = {
    author: 'Trevon Rodriguez',
    authorId: 5,
    id: 8,
    likes: 735,
    popularity: 0.76,
    reads: 8504,
    tags: ['culture', 'history'],
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('makes a get request to get blog posts', async () => {
    const result = {
      data: {
        posts: [techBlog],
      },
    };

    httpService.get.mockImplementation(async () => of(result));

    const actual = await service.getPosts('tech');

    expect(httpService.get).toHaveBeenCalledWith(
      'https://api.hatchways.io/assessment/blog/posts?tag=tech',
      { timeout: 5000 },
    );
    expect(actual).toStrictEqual(result.data);
  });

  it('can handle multiple tags', async () => {
    const techResult = {
      data: {
        posts: [techBlog],
      },
    };

    const historyResult = {
      data: {
        posts: [historyBlog],
      },
    };

    httpService.get.mockImplementation(async (url: string) =>
      of(url.includes('tech') ? techResult : historyResult),
    );

    const actual = await service.getPosts('tech', 'history');

    expect(httpService.get).toHaveBeenCalledTimes(2);
    expect(httpService.get).toHaveBeenCalledWith(
      'https://api.hatchways.io/assessment/blog/posts?tag=tech',
      { timeout: 5000 },
    );
    expect(httpService.get).toHaveBeenCalledWith(
      'https://api.hatchways.io/assessment/blog/posts?tag=history',
      { timeout: 5000 },
    );

    expect(actual.posts).toContain(techBlog);
    expect(actual.posts).toContain(historyBlog);
  });

  it('throws if no tags are provided', async () => {
    await expect(async () => await service.getPosts('')).rejects.toThrow();
  });
});
