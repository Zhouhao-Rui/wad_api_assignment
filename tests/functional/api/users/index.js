import chai from "chai";
import request from "supertest";
import dotenv from 'dotenv'
import mochaLogger from 'mocha-logger'

const expect = chai.expect;

let api;
let id;
let token = "eyJhbGciOiJIUzI1NiJ9.dXNlcjE.FmYria8wq0aFDHnzYWhKQrhF5BkJbFNN1PqNyNQ7V4M"

dotenv.config()

describe("Users endpoint", () => {
  beforeEach(function (done) {
    try {
      api = require("../../../../index");
      setTimeout(() => {
        done();
      }, 2000)
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close();
    delete require.cache[require.resolve("../../../../index")];
  });
  describe("GET /users ", () => {
    it("should return the 2 users and a status 200", (done) => {
      request(api)
        .get("/api/users")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a("array");
          done()
        });
    });
  });

  describe("POST / by action register", () => {
    it("should return a error message after registering with password less than 8", () => {
      return request(api)
        .post("/api/users")
        .query({ action: 'register' })
        .set("Accept", "application/json")
        .send({
          username: "user3",
          password: "Test111",
        })
        .expect(401)
        .then(res => {
          expect(res.body.msg).contains("Fail to create a user")
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
        .expect(401)
        .then(res => {
          expect(res.body.msg).to.contains("Fail to create a user")
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
        .expect(401)
        .then(res => {
          expect(res.body.msg).to.contains("Fail to create a user")
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
          expect(res.body).to.include({ success: true })
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
  })

  describe('POST /:userName/ratings', () => {
    it('should return 401 status when not authorized', () => {
      return request(api)
        .post('/api/users/user1/ratings')
        .set("Accept", "application/json")
        .send({
          id: 100,
          rating: 12
        })
        .expect(401)
    })
    it('should return 401 status when rating is not valid', () => {
      return request(api)
        .post('/api/users/user1/ratings')
        .set("Accept", "application/json")
        .set('Authorization', 'Bearer ' + token)
        .send({
          id: 100,
          rating: 12
        })
        .expect(401)
        .then(res => {
          expect(res.body.msg).to.eq("The rating mark is not valid!")
        })
    })
    it('should return 201 msg when rating is valid', () => {
      return request(api)
        .post('/api/users/user1/ratings')
        .set("Accept", "application/json")
        .set('Authorization', 'Bearer ' + token)
        .send({
          id: 100,
          rating: 10
        })
        .expect(201)
        .then(res => {
          expect(res.body.rate).to.eq(10)
        })
    })
  })

  describe('GET /:userName/rating', () => {
    it('should return 401 status when not authorized', () => {
      return request(api)
        .get('/api/users/user1/ratings')
        .set("Accept", "application/json")
        .expect(401)
    })
    it('should return 201 status when rating is valid', () => {
      return request(api)
        .get('/api/users/user1/ratings')
        .set("Accept", "application/json")
        .set('Authorization', 'Bearer ' + token)
        .expect(201)
        .then(res => {
          expect(res.body.length).to.eq(0)
        })
    })
  })

  describe('DELETE /:userName/rating', () => {
    beforeEach(() => {
      return request(api)
        .post('/api/users/user1/ratings')
        .set("Accept", "application/json")
        .set('Authorization', 'Bearer ' + token)
        .send({
          id: 100,
          rating: 10
        })
        .expect(201)
    })
    it('should return 401 status when not authorized', () => {
      return request(api)
        .delete('/api/users/user1/ratings')
        .set("Accept", "application/json")
        .expect(401)
    })
    it('should return 500 status when rating is not found', () => {
      return request(api)
        .delete('/api/users/user1/ratings?id=22222')
        .set("Accept", "application/json")
        .set('Authorization', 'Bearer ' + token)
        .expect(500)
    })
    it('should return 200 status when rating is found', () => {
      return request(api)
        .delete('/api/users/user1/ratings?id=100')
        .set("Accept", "application/json")
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then(res => {
          expect(res.body.msg).to.contains("Delete Success")
        })
    })
  })

  describe('POST /:username/list', () => {
    it('should return 401 status when not authorized', () => {
      return request(api)
        .post('/api/users/user1/list')
        .set("Accept", "application/json")
        .expect(401)
    })

    it('should return 201 msg when list body is valid', () => {
      return request(api)
        .post('/api/users/user1/list')
        .set("Accept", "application/json")
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: "First List",
          title: "This is the first List"
        })
        .expect(201)
        .then(res => {
          expect(res.body.list[0].name).to.eq("First List")
        })
    })
  })

  describe('GET /:username/list/:id', () => {
    beforeEach(() => {
      return request(api)
        .post('/api/users/user1/list')
        .set("Accept", "application/json")
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: "First List",
          title: "This is the first List"
        })
    })
    it('should return 401 status when not authorized', () => {
      return request(api)
        .post('/api/users/user1/list/1')
        .set("Accept", "application/json")
        .expect(401)
    })

    it('should return 200 status when movie is valid', () => {
      return request(api)
        .post('/api/users/user1/list/1')
        .set("Accept", "application/json")
        .set('Authorization', 'Bearer ' + token)
        .send({
          id: 100
        })
        .expect(200)
    })
  })

  describe('POST /:username/favourites', () => {
    beforeEach(() => {
      request(api)
        .post('/api/users/user1/favourites')
        .send({
          "id": 464052
        })
    })
    it('should return a 401 status with error message when adding twice', () => {
      request(api)
        .post('/api/users/user1/favourites')
        .send({
          "id": 464052
        })
        .expect(401)
    })
  })

});


