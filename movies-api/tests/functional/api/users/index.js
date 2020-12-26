import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import User from "../../../../api/users/userModel";
import dotenv from 'dotenv'

const expect = chai.expect;

let db;
let api;
let id;

const users = [
  {
    username: "user1",
    password: "Test1111",
  },
  {
    username: "user2",
    password: "Test2222",
  },
];

dotenv.config()

describe("Users endpoint", () => {
  before(async () => {
    mongoose.connect(process.env.mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    db = mongoose.connection;
    await User.deleteMany({});
    await users.forEach(user => User.create(user));
  });

  after(async () => {
    try {
      await db.dropDatabase();
    } catch (error) {
      console.log(error);
    }
  });
  beforeEach(async () => {
    try {
      api = require("../../../../index");

    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close();
    delete require.cache[require.resolve("../../../../index")];
  });
  describe("GET /users ", () => {
    it("should return the 2 users and a status 200", () => {
      return request(api)
        .get("/api/users")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.a("array");
        });
    });
  });

  describe("POST / by action register", () => {
    it("should return a error message after registering with password less than 8", () => {
      return request(api)
        .post("/api/users")
        .set("Accept", "application/json")
        .query({ action: 'register' })
        .send({
          username: "user3",
          password: "Test111",
        })
        .expect(500)
        .then(res => {
          expect(res.body).to.contains("Invalid password")
        })
    });

    it('should return a error message after registering with password without lower case char', () => {
      return request(api)
        .post("/api/users")
        .set("Accept", "application/json")
        .query({ action: 'register' })
        .send({
          username: "user3",
          password: "A11111111",
        })
        .expect(500)
        .then(res => {
          expect(res.body).to.contains("Invalid password")
        })
    })

    it('should return a error message after registering with password without upper case char', () => {
      return request(api)
        .post("/api/users")
        .set("Accept", "application/json")
        .query({ action: 'register' })
        .send({
          username: "user3",
          password: "a11111111",
        })
        .expect(500)
        .then(res => {
          expect(res.body).to.contains("Invalid password")
        })
    })

    it('should return a 201 status and a msg after registering with password valid', () => {
      return request(api)
        .post("/api/users")
        .set("Accept", "application/json")
        .query({ action: 'register' })
        .send({
          username: "user3",
          password: "Aa111111",
        })
        .expect(201)
        .expect({
          code: 201,
          msg: 'Successful created new user',
        })
    })
    after(() => {
      return request(api)
        .get("/api/users")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.equal(3);
          let result = res.body.map((user) => user.username);
          expect(result).to.have.members(["user1", "user2", "user3"]);
        });
    })
  });

  describe('POST /', () => {
    it('should return a 401 status and msg after logging in when username is wrong', () => {
      return request(api)
        .post('/api/users')
        .send({
          username: "user",
          password: "test1"
        })
        .expect(401)
        .expect({
          code: 401,
          msg: 'Authentication failed. User not found.',
        })
    })
    it('should return a 401 status and msg aftering logging in with wrong password', () => {
      return request(api)
        .post('/api/users')
        .send({
          username: "user1",
          password: "test"
        })
        .expect(401)
        .expect({
          code: 401,
          msg: 'Authentication failed. Wrong password.'
        })
    })
    it("should return a 200 status and msg after logging in with valid username and password", () => {
      return request(api)
        .post('/api/users')
        .send({
          username: "user1",
          password: "Test1111"
        })
        .expect(200)
        .then(res => {
          expect(res.body).to.include({success: true})
          expect(res.body).to.include.keys("token")
        })
    })
  })

  describe('PUT /:id ', () => {
    before(() => {
      return request(api)
        .get("/api/users")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          const ids = res.body.map(user => user._id)
          id = ids[0]
        });
    })
    it('When id is invalid', () => {
      return request(api)
        .put("/api/users/123")
        .set("Accept", "application/json")
        .expect(500)
    })
    it('When id is valid and password is invalid', () => {
      return request(api)
      .put(`/api/users/${id}`)
      .set("Accept", "application/json")
      .send({
        username: 'user1',
        password: '111111111'
      })
      .expect(500)
    })
    it('When id is valid and body is valid', () => {
      return request(api)
      .put(`/api/users/${id}`)
      .set("Accept", "application/json")
      .send({
        username: 'user',
        password: 'Aa111111111'
      })
      .expect(200)
    })
    after(() => {
      return request(api)
        .get("/api/users")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          const result = res.body.map(user => user.username)
          expect(result).to.have.members(["user", "user2", "user3"]);
        });
    })
  })
  

});
