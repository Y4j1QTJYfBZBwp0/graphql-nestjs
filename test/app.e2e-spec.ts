import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Get all users', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: 'query getAll{ getAllUsers { id, name, lastname }}' })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.getAllUsers).toEqual([]);
      });
  });

  it('register an user', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query:
          'mutation createUser { createUser (user: { id: "1", name: "hello", lastname: "world" }) { id, name, lastname, }}',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.createUser).toEqual({
          id: '1',
          name: 'hello',
          lastname: 'world',
        });
      });
  });

  it('register an user and get all users', async () => {
    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query:
          'mutation createUser { createUser (user: { id: "1", name: "hello", lastname: "world" }) { id, name, lastname, }}',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.createUser).toEqual({
          id: '1',
          name: 'hello',
          lastname: 'world',
        });
      });

    return await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query:
          'query getUserById{ getUserById(id: "1") { id, name, lastname, }}',
      })
      .expect(200)
      .expect((res_1) => {
        expect(res_1.body.data.getUserById).toEqual({
          id: '1',
          name: 'hello',
          lastname: 'world',
        });
      });
  });

  it('update an user and get user by id', async () => {
    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query:
          'mutation createUser { createUser (user: { id: "1", name: "hello", lastname: "world" }) { id, name, lastname, }}',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.createUser).toEqual({
          id: '1',
          name: 'hello',
          lastname: 'world',
        });
      });

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query:
          'mutation updateUser { updateUser (id: "1", user: { id: "1", name: "hello", lastname: "world 2" }) { id, name, lastname, }}',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.updateUser).toEqual({
          id: '1',
          name: 'hello',
          lastname: 'world 2',
        });
      });

    return await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query:
          'query getUserById{ getUserById(id: "1") { id, name, lastname, }}',
      })
      .expect(200)
      .expect((res_1) => {
        expect(res_1.body.data.getUserById).toEqual({
          id: '1',
          name: 'hello',
          lastname: 'world 2',
        });
      });
  });

  it('create user and delete user by id', async () => {
    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query:
          'mutation createUser { createUser (user: { id: "1", name: "hello", lastname: "world" }) { id, name, lastname, }}',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.createUser).toEqual({
          id: '1',
          name: 'hello',
          lastname: 'world',
        });
      });

    return await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: 'mutation deleteUser { deleteUser (id: "1")}',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.deleteUser).toBeTruthy();
      });
  });
});
