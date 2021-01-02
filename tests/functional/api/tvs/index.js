// import chai from "chai";
// import request from "supertest";
// import dotenv from 'dotenv'
// import mochaLogger from 'mocha-logger'

// const expect = chai.expect;

// let api;
// let id;
// let token = "eyJhbGciOiJIUzI1NiJ9.dXNlcjE.FmYria8wq0aFDHnzYWhKQrhF5BkJbFNN1PqNyNQ7V4M"

// const sampleTV = {
//   id: 87739,
//   name: "The Queen's Gambit"
// }

// dotenv.config()

// function isSorted(array) {
//   const limit = array.length - 1;
//   for (let i = 0; i < limit; i++) {
//     const current = array[i], next = array[i + 1];
//     if (current > next) { return false; }
//   }
//   return true;
// }

// describe('TV Route endpoint', () => {
//   before(function (done) {
//     setTimeout(() => {
//       done();
//     }, 3000)
//   })
//   beforeEach(function (done) {
//     try {
//       api = require("../../../../index");
//       this.timeout(6000);
//       setTimeout(() => {
//         done();
//       }, 3000)
//     } catch (err) {
//       console.error(`failed to Load user Data: ${err}`);
//     }
//   });
//   afterEach(() => {
//     api.close(); // Release PORT 8080
//     delete require.cache[require.resolve("../../../../index")];
//   });
//   describe('GET /', () => {
//     it('should return 200 status and tvs', () => {
//       return request(api)
//         .get('/api/tvs')
//         .set('Accept', 'application/json')
//         .expect(200)
//         .then(res => {
//           expect(res.body.length).not.eq(0)
//         })
//     })
//   })

//   describe('GET todaytv/page/:page', () => {
//     describe('When not have query parameters', () => {
//       it('should return the 500 status when page is invalid', () => {
//         return request(api)
//           .get('/api/tvs/todaytv/page/xx')
//           .set('Accept', 'application/json')
//           .expect(500)
//       })
//       it('should return 200 staus and tvs with todayPage', (done) => {
//         request(api)
//           .get('/api/tvs/todaytv/page/1')
//           .set('Accept', 'application/json')
//           .expect(200)
//           .then(res => {
//             expect(res.body.length).to.eq(20)
//             expect(res.body[0]).to.includes({ "todayPage": 1 })
//             done();
//           })
//       })
//     })
//     describe('When have query paramters', () => {
//       it('should return the tvs sorted by the query paramters', async () => {
//         return request(api)
//           .get('/api/tvs/todaytv/page/2?sort=popularity')
//           .set('Accept', 'application/json')
//           .expect(200)
//           .then(res => {
//             expect(res.body.length).to.eq(20)
//             expect(res.body[0]).to.includes({ "todayPage": 2 })
//             const popularities = res.body.map(tv => tv.populrity)
//             expect(isSorted(popularities)).to.eq(true)
//           })
//       })
//     })

//   })

//   describe('GET populartv/page/:page', () => {
//     describe('When not have query parameters', () => {
//       it('should return the 500 status when page is invalid', () => {
//         return request(api)
//           .get('/api/tvs/populartv/page/xx')
//           .set('Accept', 'application/json')
//           .expect(500)
//       })
//       it('should return 200 staus and tvs with popularPage', (done) => {
//         request(api)
//           .get('/api/tvs/populartv/page/1')
//           .set('Accept', 'application/json')
//           .expect(200)
//           .then(res => {
//             expect(res.body.length).to.eq(20)
//             expect(res.body[0]).to.includes({ "popularPage": 1 })
//             done();
//           })
//       })
//     })
//     describe('When have query paramters', () => {
//       it('should return the tvs sorted by the query paramters', async () => {
//         return request(api)
//           .get('/api/tvs/populartv/page/2?sort=popularity')
//           .set('Accept', 'application/json')
//           .expect(200)
//           .then(res => {
//             expect(res.body.length).to.eq(20)
//             expect(res.body[0]).to.includes({ "popularPage": 2 })
//             const popularities = res.body.map(tv => tv.populrity)
//             expect(isSorted(popularities)).to.eq(true)
//           })
//       })
//     })
//   })

//   describe('GET topratedtv/page/:page', () => {
//     describe('When not have query parameters', () => {
//       it('should return the 500 status when page is invalid', () => {
//         return request(api)
//           .get('/api/tvs/topratedtv/page/xx')
//           .set('Accept', 'application/json')
//           .expect(500)
//       })
//       it('should return 200 staus and tvs with topRatedPage', (done) => {
//         request(api)
//           .get('/api/tvs/topratedtv/page/1')
//           .set('Accept', 'application/json')
//           .expect(200)
//           .then(res => {
//             expect(res.body.length).to.eq(20)
//             expect(res.body[0]).to.includes({ "topRatedPage": 1 })
//             done();
//           })
//       })
//     })
//     describe('When have query paramters', () => {
//       it('should return the tvs sorted by the query paramters', async () => {
//         return request(api)
//           .get('/api/tvs/topratedtv/page/2?sort=popularity')
//           .set('Accept', 'application/json')
//           .expect(200)
//           .then(res => {
//             expect(res.body.length).to.eq(20)
//             expect(res.body[0]).to.includes({ "topRatedPage": 2 })
//             const popularities = res.body.map(tv => tv.populrity)
//             expect(isSorted(popularities)).to.eq(true)
//           })
//       })
//     })
//   })

//   describe('GET /hottv', () => {
//     it('should return 200 status and 20 movies', () => {
//       return request(api)
//         .get('/api/tvs/hottv')
//         .set('Accept', 'application/json')
//         .expect(200)
//         .then(res => {
//           expect(res.body.length).to.eq(20)
//         })
//     })
//   })

//   describe('GET /:id', () => {
//     it('should return 500 status when id is not valid', () => {
//       return request(api)
//         .get('/api/tvs/xx')
//         .set('Accept', 'application/json')
//         .expect(500)
//     })
//     it('should return 200 status and tv detail', () => {
//       return request(api)
//         .get(`/api/tvs/${sampleTV.id}`)
//         .set('Accept', 'application/json')
//         .expect(200)
//         .then(res => {
//           expect(res.body[0].name).to.eq(sampleTV.name)
//         })
//     })
//   })

//   describe('GET /:id/similar', () => {
//     it('should return 500 status when id is not valid', () => {
//       return request(api)
//         .get('/api/tvs/xx/similar')
//         .set('Accept', 'application/json')
//         .expect(500)
//     })
//     it('should return 200 status and tv detail', () => {
//       return request(api)
//         .get(`/api/tvs/100/similar`)
//         .set('Accept', 'application/json')
//         .expect(200)
//         .then(res => {
//           expect(res.body.length).to.eq(20)
//         })
//     })
//   })

//   describe('GET /search/:page', () => {
//     it('should return 200 status and tv detail', () => {
//       return request(api)
//         .get(`/api/tvs/search/1?search=Iron`)
//         .set('Accept', 'application/json')
//         .expect(200)
//         .then(res => {
//           expect(res.body.length).to.eq(20)
//         })
//     })
//   })

//   describe('GET /:id/reviews', () => {
//     it('should return 200 status and reviews', () => {
//       return request(api)
//         .get(`/api/tvs/87739/reviews`)
//         .set('Accept', 'application/json')
//         .expect(200)
//         .then(res => {
//           expect(res.body.length).to.eq(2)
//         })
//     })
//   })
  
  
// })
