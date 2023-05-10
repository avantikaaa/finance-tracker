const request = require('supertest');
const index = require('../index');

const app = index.app;

describe('POST /register', () => {
    it('attempts to create a new user', (done) => {
      request(app)
        .post('/aregister')
        .send({
          name: 'John Doe',
          username: 'avantika',
          password: 'password123',
          limit: 1000
        })
        .expect(409)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.message).toBe('username in use');
          done();
        });
    });
  });