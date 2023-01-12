import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { BlogService } from '../blog/blog.service';
import { SampleResponse } from '../test/data.test';

describe('PostService', () => {
  let postService: PostService;
  const blogService = {
    getPosts: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService, BlogService],
    })
      .overrideProvider(BlogService)
      .useValue(blogService)
      .compile();

    postService = module.get<PostService>(PostService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    blogService.getPosts.mockImplementation(() => SampleResponse);
  });

  it('should be defined', () => {
    expect(postService).toBeDefined();
  });

  it('should sort posts by default if no sortBy is provided', async () => {
    const posts = await postService.getPosts({ tags: ['tech'] });
    const result = { posts: [...SampleResponse.posts] };
    result.posts.sort((a, b) => a.id - b.id);
    expect(posts.posts).toEqual(SampleResponse.posts);
  });
});
