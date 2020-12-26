import chai from "chai";
import request from "supertest";
import mochaLogger from 'mocha-logger'
const mongoose = require("mongoose");
import User from "../../../../api/users/userModel";
import dotenv from 'dotenv'

const expect = chai.expect;

let db;
let api;
let token;

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

const sampleMovie = {
  id: 337401,
  title: "Mulan",
};

const sampleReview = {
  "author": "Kamurai",
  "author_details": {
    "name": "Kamurai",
    "username": "Kamurai",
    "avatar_path": "/sKeC7qZLAKreuwxH4x6U3mN7Aa8.jpg",
    "rating": 5
  },
  "content": "Disappointing watch, probably won't watch again, and can't recommend.\r\n\r\nI finally see what everyone is freaking out about this movie.  Mostly, it is because it just left all the spirit of the first movie behind and started over. \r\n\r\nThey made a conscious effort to ditch the goofiness, and magic animals of the first one to do a more gritty and real version, like a DC movie.  After those decisions, they also chose to reintroduce actual magic, but mostly for the villains, who had slightly better women's rights(?).\r\n\r\nI'll be honest, the movie itself wasn't interesting enough to follow completely.  For instance, I know \"Mushu\" was replaced with a phoenix, but I have no idea what happened to it.\r\n\r\nMulan also is outed much sooner in this, but basically skirts execution about 3 different times because of her accomplishments with a much more laid back atmosphere than it was in the 1998 version.\r\n\r\nDespite all the money poured into the movie that keeps it from being a bad movie, it just doesn't feel good.  While it is wonderous at times, it just lacks the heart warming charm that one would expect from a Disney movie.",
  "created_at": "2020-12-10T17:05:26.729Z",
  "id": "5fd25556d7cd06003f7fc60f",
  "updated_at": "2020-12-19T18:40:11.291Z",
  "url": "https://www.themoviedb.org/review/5fd25556d7cd06003f7fc60f"
}

dotenv.config()

describe("Movies endpoint", () => {
  before(async () => {
    mongoose.connect(process.env.mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = mongoose.connection;
    await User.deleteMany({});
    await users.forEach(user => User.create(user));
    api = require("../../../../index");
    request(api)
      .post("/api/users")
      .send({
        username: "user1",
        password: "Test1111"
      })
      .then(res => {
        token = res.body.token
      })
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
    api.close(); // Release PORT 8080
    delete require.cache[require.resolve("../../../../index")];
  });

  describe("GET /movies ", () => {
    it("should return no movies when no authorized", (done) => {
      request(api)
        .get("/api/movies")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .end((err, res) => {
          expect(res.body).to.be.empty;
          done();
        });
    })
    it("should return 20 movies and a status 200 when authorized", (done) => {
      request(api)
        .get("/api/movies")
        .set('Authorization', token)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.equal(20);
          done();
        });
    });
  });

  describe('GET /movies/:id', () => {
    describe('when no authorized', () => {
      it("should return empty body", () => {
        request(api)
          .get(`/api/movies/${sampleMovie.id}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .then(res => {
            expect(res.body).to.be.empty;
          })
      })
    })

    describe('when authorized', () => {
      describe("when the id is valid", () => {
        it("should return the matching movie", () => {
          return request(api)
            .get(`/api/movies/${sampleMovie.id}`)
            .set('Authorization', token)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
              expect(res.body).to.have.property("title", sampleMovie.title);
            });
        });
      });
      describe("when the id is invalid", () => {
        it("should return the NOT found message", () => {
          return request(api)
            .get("/api/movies/xxx")
            .set('Authorization', token)
            .set("Accept", "application/json")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(500)
        });
      });
    })
  })

});