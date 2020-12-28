import chai from "chai";
import request from "supertest";
import dotenv from 'dotenv'

const expect = chai.expect;
dotenv.config()

let api;
let token = "eyJhbGciOiJIUzI1NiJ9.dXNlcjE.FmYria8wq0aFDHnzYWhKQrhF5BkJbFNN1PqNyNQ7V4M"

const sampleMovie = {
  id: 337401,
  title: "Mulan",
};


describe("Movies endpoint", () => {
  beforeEach(function(done) {
    try {
      api = require("../../../../index");
      this.timeout(6000);
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
    describe('When no authorized', () => {
      it("should return no movies", () => {
        return request(api)
          .get("/api/movies")
          .set("Accept", "application/json")
          .then(res => {
            expect(res.body).to.be.empty;
          });
      })
    })
    describe('When authorized', () => {
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
    })
  });

  describe('GET /movies/:id', () => {
    describe('when no authorized', () => {
      it("should return empty body", () => {
        return request(api)
          .get(`/api/movies/${sampleMovie.id}`)
          .set('Accept', 'application/json')
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
            .set("Accept", "application/json")
            .set("Authorization", "Bearer " + token)
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
          .set("Accept", "application/json")
          .set("Authorization", "Bearer " + token)
          .expect(500);
        });
      });
    })
  })

});