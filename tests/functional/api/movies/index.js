import chai from "chai";
import request from "supertest";
import dotenv from 'dotenv'

const expect = chai.expect;
dotenv.config()

let api;
let token = "eyJhbGciOiJIUzI1NiJ9.dXNlcjE.FmYria8wq0aFDHnzYWhKQrhF5BkJbFNN1PqNyNQ7V4M"

const sampleMovie = {
  id: 508442,
  title: "Soul",
};

describe("Movies endpoint", () => {
  beforeEach(function (done) {
    try {
      api = require("../../../../index");
      this.timeout(8000);
      setTimeout(() => {
        done();
      }, 3000)
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close(); // Release PORT 8080
    delete require.cache[require.resolve("../../../../index")];
  });

  describe("GET /movies ", () => {
      it("should return 20 movies and a status 200", (done) => {
        request(api)
          .get("/api/movies")
          .set('Authorization', 'Bearer ' + token)
          .set("Accept", "application/json")
          .expect(200)
          .then(res => {
            expect(res.body).to.be.a("array");
            expect(res.body.length).to.equal(20);
            done()
          });
      });
  });

  describe('GET /movies/:id', () => {
      // describe("when the id is valid", () => {
      //   it("should return the matching movie", () => {
      //     return request(api)
      //       .get(`/api/movies/${sampleMovie.id}`)
      //       .set("Accept", "application/json")
      //       .set("Authorization", "Bearer " + token)
      //       .expect(200)
      //       .then((res) => {
      //         expect(res.body).to.have.property("title", sampleMovie.title);
      //       });
      //   });
      describe("when the id is invalid", () => {
        it("should return the NOT found message", () => {
          return request(api)
            .get("/api/movies/xxx")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer " + token)
            .expect(500);
        });
      });
    // })
  })

  describe('GET /movies/page/:page', () => {
    describe('When page is not valid', () => {
      it('should return the 500 error', () => {
        return request(api)
          .get('/api/movies/page/xx')
          .set("Accept", "application/json")
          .set("Authorization", "Bearer " + token)
          .expect(500);
      })
    })

    describe('When page is valid', () => {
      it('should return the movies', () => {
        return request(api)
          .get('/api/movies/page/2')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .then(res => {
            expect(res.body.length).to.eq(20);
          })
      })
    })
  })


  describe('GET /movies/upcoming/:page', () => {
    describe('When page is not valid', () => {
      it('should return the 500 error', () => {
        return request(api)
          .get('/api/movies/upcoming/xx')
          .set("Accept", "application/json")
          .set("Authorization", "Bearer " + token)
          .expect(500);
      })
    })

    describe('When page is valid', () => {
      it('should return the movies', () => {
        return request(api)
          .get('/api/movies/upcoming/2')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
      })
    })
  })

  describe('GET /movies/:id/reviews', () => {
    it('should return the reviews', () => {
      return request(api)
        .get('/api/movies/577922/reviews')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
    })
  })

});