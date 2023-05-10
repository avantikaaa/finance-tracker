const request = require('supertest');
const index = require('./index');
const mongoose = require("mongoose");

const app = index.app;
// const server = index.server;
describe('POST /register', () => {
    it('attempts to create a new user', (done) => {
      request(app)
        .post('/register')
        .send({
          name: 'John Doe',
          username: 'avantika',
          password: 'password123',
          limit: 1000
        })
        .expect(409)
        .end((err, res) => {
          if (err) return done(err);
          console.log(res.body.message);
          expect(res.body.message).toBe("username in use");
          done();
        });
    });
});


// index.stop();

afterAll(() => {
    index.server.close();
    mongoose.connection.close();
});