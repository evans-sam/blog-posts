import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { SampleResponse } from './data.test';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/ping (GET)', () => {
    request(app.getHttpServer())
      .get('/api/ping')
      .expect(200)
      .expect({ success: true });
  });

  it('/api/posts (GET) requires tag param', () => {
    request(app.getHttpServer())
      .get('/api/posts?sortBy=likes&direction=desc')
      .expect(400)
      .expect({ error: 'Tags parameter is required' });
  });

  it('/api/posts (GET) does not allow invalid sorts', () => {
    request(app.getHttpServer())
      .get('/api/posts?tags=history,tech&sortBy=something&direction=desc')
      .expect(400)
      .expect({ error: 'sortBy parameter is invalid' });
  });

  it('/api/posts (GET) does not allow invalid sort direction', () => {
    request(app.getHttpServer())
      .get('/api/posts?tags=history,tech&sortBy=likes&direction=somethingelse')
      .expect(400)
      .expect({ error: 'direction parameter is invalid' });
  });

  it('/api/posts (GET) returns posts', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/posts?tags=history,tech&sortBy=likes&direction=desc')
      .expect(200);
    expect(response.body).toStrictEqual(SampleResponse);
  });

  it('/api/posts (GET) sorts posts', async () => {
    const result = { posts: [...SampleResponse.posts] };
    result.posts.sort((a, b) => b.id - a.id);

    const response = await request(app.getHttpServer())
      .get('/api/posts?tags=history,tech&sortBy=id&direction=desc')
      .expect(200);

    expect(response.body).toStrictEqual(result);
  });

  it('/api/posts (GET) returns filtered posts', async () => {
    const result = {
      posts: SampleResponse.posts.filter((post) => post.tags.includes('tech')),
    };

    const response = await request(app.getHttpServer())
      .get('/api/posts?tags=tech&sortBy=likes&direction=desc')
      .expect(200);

    expect(response.body).toStrictEqual(result);
  });

  it('/api/posts (GET) defaults to sorting by id asc', async () => {
    const result = { posts: [...SampleResponse.posts] };
    result.posts.sort((a, b) => a.id - b.id);

    const response = await request(app.getHttpServer())
      .get('/api/posts?tags=tech,history')
      .expect(200);

    expect(response.body).toStrictEqual(result);
  });

  afterAll(async () => await app.close());
});
