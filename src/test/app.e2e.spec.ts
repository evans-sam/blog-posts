import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { routeTwoResponse } from './data.test';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect({ success: true });
  });

  it('/api/posts (GET) requires tag param', () => {
    return request(app.getHttpServer())
      .get('/api/posts?sortBy=likes&direction=desc')
      .expect(400)
      .expect({ error: 'Tags parameter is required' });
  });

  it('/api/posts (GET) does not allow invalid sorts', () => {
    return request(app.getHttpServer())
      .get('/api/posts?tags=history,tech&sortBy=something&direction=desc')
      .expect(400)
      .expect({ error: 'sortBy parameter is invalid' });
  });

  it('/api/posts (GET) does not allow invalid sort direction', () => {
    return request(app.getHttpServer())
      .get('/api/posts?tags=history,tech&sortBy=likes&direction=somethingelse')
      .expect(400)
      .expect({ error: 'direction parameter is invalid' });
  });

  it('/api/posts (GET) returns posts', () => {
    return request(app.getHttpServer())
      .get('/api/posts?tags=history,tech&sortBy=likes&direction=desc')
      .expect(200)
      .expect(routeTwoResponse);
  });

  afterAll(async () => await app.close());
});
