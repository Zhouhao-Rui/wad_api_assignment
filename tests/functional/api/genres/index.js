import chai from "chai";
import request from "supertest";

const expect = chai.expect

let api;

describe('Genres endpoints', () => {
  beforeEach(() => {
    try {
      api = require("../../../../index");
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }
  });
  afterEach((done) => {
    api.close();
    delete require.cache[require.resolve("../../../../index")];
    done();
  });

  describe('GET /', () => {
    it('shoudl return the genres', () => {
      request(api)
        .get('/api/genres')
        .set('Accept', 'Application/json')
        .expect(200)
        .then(res => {
          expect(res.body).length.to.eq(19)
          expect(res.body).to.has.members([{
            "id": 28,
            "name": "Action"
        }])
        })
    })
  })
})



