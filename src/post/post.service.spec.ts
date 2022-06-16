import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { BlogService } from '../blog/blog.service';
import { routeTwoResponse } from '../test/data.test';

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
    blogService.getPosts.mockImplementation(() => routeTwoResponse);
  });

  it('should be defined', () => {
    expect(postService).toBeDefined();
  });
});
