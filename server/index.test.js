const request = require('supertest');
const index = require('./index');
const mongoose = require("mongoose");

const app = index.app;

var cookies;
// const server = index.server;
describe('POST /register', () => {
    it('attempts to create an existing user', (done) => {
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
          expect(res.body.message).toBe("username in use");
          done();
        });
    });
});

describe('POST /login', () => {
    it('wrong password login', (done) => {
      request(app)
        .post('/login')
        .send({
          username: 'neelabh',
          password: 'neelabh1',
        })
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.message).toBe("invalid credentials");
          done();
        });
    });
});

describe('POST /login', () => {
    it('right password login', (done) => {
      request(app)
        .post('/login')
        .send({
          username: 'nidhish',
          password: 'avantika',
        })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          cookies = res.headers['set-cookie'];
          done();
        });
    });
});


describe('GET /profile', () => {
    it('get profile', (done) => {
      request(app)
        .get('/profile')
        .set('cookie', cookies)
        .expect(200, done);
    });
});


describe('GET /getCurrentLending', () => {
    it('get the transactions where i have lended', (done) => {
      request(app)
        .get('/getCurrentLending')
        .set('cookie', cookies)
        .expect(200, done);
    });
});

describe('POST /addLending', () => {
    it('lend money to peer', (done) => {
      request(app)
        .post('/addLending')
        .send({
            amount: "100",
            to: "neelabh",
            from: "nidhish",
            interest: 0,
            date: "2023-05-17T13:24:00",
            dueDate:"2023-05-17T13:24:00"
        })
        .set('cookie', cookies)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
});

describe('POST /addExpense', () => {
    it('add expense', (done) => {
      request(app)
        .post('/addExpense')
        .send({
            amount: "100",
            to: "canteen",
            catagory: "test",
            date: "2023-05-17T13:24:00",
        })
        .set('cookie', cookies)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
});

describe('GET /getCurrentExpense', () => {
  it('get current expense', (done) => {
    request(app)
      .get('/getCurrentExpense')
      .set('cookie', cookies)
      .expect(200, done);
  });
});

describe('GET /getCurrentIncome', () => {
  it('get current income', (done) => {
    request(app)
      .get('/getCurrentIncome')
      .set('cookie', cookies)
      .expect(200, done);
  });
});


describe('GET /getDues', () => {
  it('get dues as of today', (done) => {
    request(app)
      .get('/getDues')
      .set('cookie', cookies)
      .expect(200, done);
  });
});

describe('GET /getHistory', () => {
  it('get history', (done) => {
    request(app)
      .get('/getHistory')
      .set('cookie', cookies)
      .expect(200, done);
  });
});

describe('GET /getBalance', () => {
  it('get balance', (done) => {
    request(app)
      .get('/getBalance')
      .set('cookie', cookies)
      .expect(200, done);
  });
});

describe('GET /getFriends', () => {
  it('get list of friends', (done) => {
    request(app)
      .get('/getFriends')
      .set('cookie', cookies)
      .expect(200, done);
  });
});

describe('GET /getUserInfo', () => {
  it('get user info', (done) => {
    request(app)
      .get('/getUserInfo')
      .set('cookie', cookies)
      .expect(200, done);
  });
});

describe('GET /getReminder', () => {
  it('get reminder', (done) => {
    request(app)
      .get('/getReminder')
      .set('cookie', cookies)
      .expect(200, done);
  });
});

// index.stop();

afterAll(() => {
    index.server.close();
    mongoose.connection.close();
});