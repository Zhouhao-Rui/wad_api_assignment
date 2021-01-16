# Assignment 2 - Web API.

Name: Zhouhao Rui

## Features.

For all the APIs in the system, first time when request the API server, it will proxy the data from TMDB and load the data into database. Next time It will directly load the data from the cloud database by finding the documents with corresponding upcoming page number.

 + Feature 1 - Get the movies by page for the react app's pagination functionality. I defined a page field in the movie Schema, and this will help to do the selector query. 
 + Feature 2 - Get the upcoming movies by page for the react app's pagination functionality. I defined a upcoming page field in the movie Schema, and this will help to do the selector query. 
 + Feature 3 - Store the movie reviews in the database for the data persistence. I defined a new collection called Reviews to store the reviews of the movies. And the Movie schema also contain a  field called reviews with type of **ObjectId** ref to the Reviews Collection. 
 + Feature 4 - Store the review's author information in the database for the data persistence.  I defined a new collection called Author to store the information of the author. And the Reviews collection has one field called author with type of ObjectId ref to the Author collection.
 + Feature 5 - Search for the movies with the particular keyword. I proxy the search media interface in the TMDB.
 + Feature 6 - Delete the user. 
 + Feature 7 - rate or update rating for the particular TV in the system by the authorized user. I defined a new model called Rating model, and contains the rate, tv, user field. 
 + Feature 8 - user can view all the rated TVs. I defined a field called ratings refs to the Rating model in the user model. Using the populate function to get the full TV information.
 + Feature 9 - user can create a list to store the movies. I defined a list field in the user schema which contains all the lists of the user own, including the id, name, title and movies.
 + Feature 10 - user can get the specific list by id
 + Feature 11 - user can add new movie into the list without repeatedly adding.
 + Feature 13 - get the today's TVs by page with the query parameter. The tv can be sorted by popularity, vote_count, vote_average and first_air_time by the corresponding query parameters. I defined a todayPage field in the TV Schema, and this will help to do the selector query. 
 + Feature 14 - get the popular TVs by page with the query parameter. The tv can be sorted by popularity, vote_count, vote_average and first_air_time by the corresponding query parameters. I defined a popularPage field in the TV Schema, and this will help to do the selector query. 
 + Feature 15 - get the topRated TVs by page with the query parameter. The tv can be sorted by popularity, vote_count, vote_average and first_air_time by the corresponding query parameters. I defined a topRatedPage field in the TV Schema, and this will help to do the selector query. 
 + Feature 16 - get the hot TVs. I defined a hot field in the TV Schema, and this will help to do the selector query. 
 + Feature 17 - get the particular TV's ratings. I defined a field called ratings refs to the Rating model in the TV model. Using the populate function to get the full user information.
 + Feature 18 - get the similar TVs of a particular TV. I defined a field called similar refs to the TV model. Using the populate function to get the full similar TVs' information.
 + Feature 19 - proxy the search API in TMDB and search TVs by the particular keyword by page.
 + Feature 20 - get the reviews of the specific TV with population with the Review model and author model.
 + Feature 21 - get the creators of the specific TV by Id. I defined a new schema called Creator Schema to deal with the storage of information.
 + Feature 22 - customized password validation.

Describe what needs to be on the machine to run the API (Node v?, NPM, MongoDB instance, any other 3rd party software not in the package.json). 

- Need to be run on the node 12, latest npm version, and cloud mongdb. The third party optimizely-express limit the customer of some routes.

Describe getting/installing the software, perhaps:

```bat
git clone https://github.com/Zhouhao-Rui/wad_api_assignment.git
```

followed by installation

```bat
npm i
npm start -- start for the app with port 8080
npm run start:swagger -- start for the app with port 8080 with swagger(/api-docs)
npm run start:lambda -- start the netlify server with port 9000
```

## API Configuration
```bat
NODE_ENV=development
PORT=8080
HOST=
TMDB_KEY=MONGODB
mongoDB=CLOUDMongoURL
seedDb=true
secret=JWT TOKEN SALT
```


## API Design
| Name                             | GET                                            | POST                          | PUT                           | DELETE                  |
| -------------------------------- | ---------------------------------------------- | ----------------------------- | ----------------------------- | ----------------------- |
| /api/movies                      | Gets a list of movies                          | N/A                           | N/A                           | N/A                     |
| /api/movies/page/:page           | Get movies by page                             | N/A                           | N/A                           | N/A                     |
| /api/movies/:id                  | Get specific movie by id                       | N/A                           | N/A                           | N/A                     |
| /api/movies/upcoming/:page       | Get upcoming movies by page                    | N/A                           | N/A                           | N/A                     |
| /api/movies/:id/reviews          | Get the reviews of specific movie              | N/A                           | N/A                           | N/A                     |
| /api/movies/search/:query        | Search the movies by query parameter           | N/A                           | N/A                           | N/A                     |
| /api/users                       | Get all the users                              | Register/Login in the system  | N/A                           | N/A                     |
| /api/users/:username             | N/A                                            | N/A                           | N/A                           | delete user by username |
| /api/users/:id                   | N/A                                            | N/A                           | modify user information by id | N/A                     |
| /api/users/:userName/favorites   | get users' favorites movies                    | add favorite movies to user   | N/A                           | N/A                     |
| /api/users/:userName/ratings     | get users' rated tvs                           | rate tv by user               | N/A                           | delete user's rating    |
| /api/users/:userName/ratings/:id | get specific rating tv of user                 | N/A                           | N/A                           | N/A                     |
| /api/users/:username/list        | get all the lists for the user                 | create a list for user        | N/A                           | N/A                     |
| /api/users/:username/list/:id    | view the information of a specific list        | Add movies to a specific list | N/A                           | N/A                     |
| /api/tvs/todaytv/page/:page      | get today tvs by page                          | N/A                           | N/A                           | N/A                     |
| /api/tvs/populartv/page/:page    | get popular tvs by page                        | N/A                           | N/A                           | N/A                     |
| /api/tvs/topratedtv/page/:page   | get toprated tvs by page                       | N/A                           | N/A                           | N/A                     |
| /api/tvs/hottv                   | get hot tvs by page                            | N/A                           | N/A                           | N/A                     |
| /api/tvs/:id                     | get the specific tv information                | N/A                           | N/A                           | N/A                     |
| /api/tvs/:id/ratings             | get the specific tv's ratings                  | N/A                           | N/A                           | N/A                     |
| /api/tvs/:id/similar             | get the similar TVs of the specific tv         | N/A                           | N/A                           | N/A                     |
| /api/tvs/search/:page            | search the tvs by keyword with page parameters | N/A                           | N/A                           | N/A                     |
| /api/tvs/:id/reviews             | get the specific tv's reviews                  | N/A                           | N/A                           | N/A                     |
| /api/creators/:id                | get the creators by id                         | N/A                           | N/A                           | N/A                     |
| /api/genres                      | get all the genres                             | N/A                           | N/A                           | N/A                     |

The swagger is shown below, I deploy it on the heroku.

![][swagger_one]

![][swagger_two]

Link: https://movies-api-assignment-rzh.herokuapp.com/api-docs/

It will be a little bit slow to open the application because of the heavy third-party package.

## Security and Authentication

The system uses the passport policy to validate the Bearer token in advance without session. It means the user can take the token for all the time. This design is for the test convenience. 

**protect routes:**

- /api/users/:username/favourites POST
- /api/users/:username/favourites GET
- /api/users/:username/ratings POST
- /api/users/:username/ratings DELETE
- /api/users/:username/ratings GET
- /api/users/:username/ratings/${id} GET
- /api/users/:username/list POST
- /api/users/:username/list/:id GET
- /api/user/:username/list/:id POST
- /api/users/:username/list GET

I also use the third-party package **helmet** to help the service to protect routers through the formatting of request headers. 

![][helmet]



## Integrating with React App

I change most of the routes in the React app with my own API server router, expect the similar TVs, search TV routes. For the similar TV in my API server only responses with the movies in the database, it's not conducive to data show.  For the search TV I only proxy the search TV route in the TMDB, so it's not necessary.

I used to use the firebase in the system to serve the login, and I now change the signin and signup method in the API server.

```js
export const signup = (data) => {
  return postData(`${base_url}/api/users?action=register`, data)
}
export const signin = (data) => {
  return postData(`${base_url}/api/users`, data)
}
```

I store the username, token in the local storage, and for the user's private route I get the items from the local storage.

~~~Javascript
export const postTVRating = (id, val) => {
  const data = {
    "id": id,
    "rating": val
  }
  return fetch(`${base_url}/api/users/${window.localStorage.getItem("username")}/ratings`, {
    body: JSON.stringify(data), 
    cache: 'no-cache', 
    credentials: 'same-origin',
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json',
      'Authorization': window.localStorage.getItem('token')
    },
    method: 'POST', 
    mode: 'cors', 
    redirect: 'follow', 
    referrer: 'no-referrer', 
  })
}
~~~

For the rating, marking favorite and list functionality, I store all data in its own cloud database without working through the TMDB.

The moviesApp url is shown below:

https://github.com/Zhouhao-Rui/wad2-moviesApp

*I only do the refactor work in the master branch.*



following the steps:

- run npm i, npm start in the react app
- run npm i, npm run start:lambda in the express API

It can run smoothly for most of the features except posting reviews.

## Extra features

- customized password validation. I use the validate pre hook for the user model to give the user password higher level validation.  And it will also be carried out in the updateOne pre hook to validate whether the password is valid.

  ![][validator]

- Simple recommend algorithm design. The netflix and spotify algorithm are recommended in the assignment requirements, but I did not find it. I write an algorithm to recommend the movie both based on the movie's attributes and the user's preference.  

  I traverse all the movies that users marked favorite and got the data based on the interface of similar movies. Then I calculated the weighted score of the movies. The weight of popularity is 0.4, and the weight of vote average and vote count is 0.3. I use these three attributes to sort the movies separately and get the ranking. The score calculation formula is
  $$
  scrore = 0.3 * vote_average_ranking + 0.3 * vote_count_ranking + 0.4 * popularity_ranking
  $$
  And I choose the five lowest score similar movies for each favorite movie. Combine all the chosen similar movies and send back to the specific user.

  ![][recommendator]

  ![][recommendator_result]

- swagger building. I build the swagger documentation in the heroku. It includes the authorization so every route can be visited.

![][heroku_overview]

## Independent learning.

. . State the non-standard aspects of React/Express/Node (or other related technologies) that you researched and applied in this assignment . .  

- helmet

I use the third-party package **helmet** to help the service to protect routers through the formatting of request headers. 

![][helmet]

- swagger UI

 I build the swagger documentation in the heroku. It includes the authorization so every route can be visited. I implement the swagger with swagger.json.

- Cors

I use the Cors middleware to deal with the cross-origin. problem for the react-express integration .

![][Cors]

- Serverless function

I use the serverless functions to build the serverless cloud service on the Netlify. and it can be runned by the netlify-cli.

 ![][serverless]

![][netlify_cli]

- Optimizely-express

I use the optimizely-express to limit the target customer to the experiment route.

![][optimize_express]



# Assignment 2 - Agile Software Practice.

Name: Zhouhao Rui

## Target Web API.

| Name                             | GET                                            | POST                          | PUT                           | DELETE                  |
| -------------------------------- | ---------------------------------------------- | ----------------------------- | ----------------------------- | ----------------------- |
| /api/movies                      | Gets a list of movies                          | N/A                           | N/A                           | N/A                     |
| /api/movies/page/:page           | Get movies by page                             | N/A                           | N/A                           | N/A                     |
| /api/movies/:id                  | Get specific movie by id                       | N/A                           | N/A                           | N/A                     |
| /api/movies/upcoming/:page       | Get upcoming movies by page                    | N/A                           | N/A                           | N/A                     |
| /api/movies/:id/reviews          | Get the reviews of specific movie              | N/A                           | N/A                           | N/A                     |
| /api/movies/search/:query        | Search the movies by query parameter           | N/A                           | N/A                           | N/A                     |
| /api/users                       | Get all the users                              | Register/Login in the system  | N/A                           | N/A                     |
| /api/users/:username             | N/A                                            | N/A                           | N/A                           | delete user by username |
| /api/users/:id                   | N/A                                            | N/A                           | modify user information by id | N/A                     |
| /api/users/:userName/ratings     | get users' rated tvs                           | rate tv by user               | N/A                           | delete user's rating    |
| /api/users/:userName/ratings/:id | get specific rating tv of user                 | N/A                           | N/A                           | N/A                     |
| /api/users/:username/list        | get all the lists for the user                 | create a list for user        | N/A                           | N/A                     |
| /api/users/:username/list/:id    | view the information of a specific list        | Add movies to a specific list | N/A                           | N/A                     |
| /api/tvs/todaytv/page/:page      | get today tvs by page                          | N/A                           | N/A                           | N/A                     |
| /api/tvs/populartv/page/:page    | get popular tvs by page                        | N/A                           | N/A                           | N/A                     |
| /api/tvs/topratedtv/page/:page   | get toprated tvs by page                       | N/A                           | N/A                           | N/A                     |
| /api/tvs/hottv                   | get hot tvs by page                            | N/A                           | N/A                           | N/A                     |
| /api/tvs/:id                     | get the specific tv information                | N/A                           | N/A                           | N/A                     |
| /api/tvs/:id/ratings             | get the specific tv's ratings                  | N/A                           | N/A                           | N/A                     |
| /api/tvs/:id/similar             | get the similar TVs of the specific tv         | N/A                           | N/A                           | N/A                     |
| /api/tvs/search/:page            | search the tvs by keyword with page parameters | N/A                           | N/A                           | N/A                     |
| /api/tvs/:id/reviews             | get the specific tv's reviews                  | N/A                           | N/A                           | N/A                     |

The swagger screenshot is shown below:

![][swagger_one]

![][swagger_two]

link: https://movies-api-assignment-rzh.herokuapp.com/api-docs

It will be a bit slow to open because of heavy third-party package.

## Error/Exception Testing.

+ POST /api/users?action=register

+ test when password less than 8, See /tests/functional/api/users/index.js

  ```js
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
  ```
+ POST /api/users?action=register
+ test when password without low case char, See /tests/functional/api/users/index.js
```js
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
```

- POST /api/users?action=register
- test when password without upper case char, See /tests/functional/api/users/index.js

```js
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
```

- POST /api/users
- test when username is wrong, system will return user not found. See /tests/functional/api/users/index.js

```js
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
```

- POST /api/users
- test when password is wrong, system will return Wrong password. See /tests/functional/api/users/index.js

```js
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
```

- PUT /api/users/:id

- test when the password in the request body is invalid, it will return 500.See /tests/functional/api/users/index.js

```js
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
```

- POST /api/users/:userName/ratings
- test when user is not authorized, and it will return 401

```js
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
```

- POST /api/users/:userName/ratings
- test when user rating mark is not in the range of 0 - 10. it will return the rating mark is not valid. See /tests/functional/api/users/index.js

```js
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
```

- DELETE /api/users/:userName/ratings

- test when user is not authorized, and it will return 401.See /tests/functional/api/users/index.js

```js
it('should return 401 status when not authorized', () => {
      return request(api)
        .delete('/api/users/user1/ratings')
        .set("Accept", "application/json")
        .expect(401)
    })
```

- DELETE /api/users/:userName/ratings
- test when the tv id is not found, it will return 500 message. See /tests/functional/api/users/index.js

```js
 it('should return 500 status when rating is not found', () => {
      return request(api)
        .delete('/api/users/user1/ratings?id=22222')
        .set("Accept", "application/json")
        .set('Authorization', 'Bearer ' + token)
        .expect(500)
    })
```

- POST /api/users/:username/list
- test when the user is not authorized, it will return 401.See /tests/functional/api/users/index.js

```js
it('should return 401 status when not authorized', () => {
      return request(api)
        .post('/api/users/user1/list')
        .set("Accept", "application/json")
        .expect(401)
    })
```

- POST /:username/favourites
- test when the moive adding twice, and it will return 401 status. See /tests/functional/api/users/index.js

```js
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
```

- GET /todaytv/page/:page
- test when the page is not valid, and it will return 500. See in /tests/functional/api/tvs/index.js

```js
 it('should return the 500 status when page is invalid', () => {
        return request(api)
          .get('/api/tvs/todaytv/page/xx')
          .set('Accept', 'application/json')
          .expect(500)
      })
```

- GET /movies/:id
- test when the id is not valid, and it will return 500. See in tests/functional/api/moives/index.js

```js
describe("when the id is invalid", () => {
        it("should return the NOT found message", () => {
          return request(api)
            .get("/api/movies/xxx")
            .set("Accept", "application/json")
            .set("Authorization", "Bearer " + token)
            .expect(500);
        });
      });
```


## Continuous Delivery/Deployment.

+ https://stoic-bartik-e4ab41.netlify.app/ - Staging deployment
+ https://reverent-lalande-520233.netlify.app/- Production
+ https://movies-api-assignment-rzh.herokuapp.com/api-docs/ - swagger documentation

![][netlify_overview]

+ **Staging app overview** 

  staging site overview:

![][netlify_staging_overview]

​		staging environment variable

![][netlify_staging_variables]

​		staging public

​	![][netlify_staging_public]

​		staging routes example

​	![][netlify_staging_tvs]

+ **Production app overview** 

  production site overview

![][netlify_production_overview]

​		production environment

​		![][netlify_production_variables]

​		production public

​		![][netlify_production_public]

​		production routes example

​		![][netlify_production_tvs]

**note**: netlify uses serverless functions, and the default route is /.netlify/functions/*, so the node service will not be started when first enter into the website's root route because not reaching the default node server routes. This causes the first access to the data may cause empty, because the storage and loading of seeddata takes a while. But it will respond normally after the second visit.



**Swagger overview**

For the swagger documentation, the netlify does not support swagger by default, so I put it on heroku.

![][heroku_overview]

![][heroku_swagger]



## Feature Flags (If relevant)

I control the api/tvs and api/creators routes with the flag tv. 

relative code:

```js
app.use('/.netlify/functions/api/tvs', function(req, res, next) {
  const isEnabled = req.optimizely.client.isFeatureEnabled(
    'tv', 
    'user123',
    {
      customerId: 123,
      isVip: true
    }
  )

  if (isEnabled) {
    next();
  }
}, TVRouter);
app.use('/.netlify/functions/api/creators', function(req, res, next) {
  const isEnabled = req.optimizely.client.isFeatureEnabled(
    'tv', 
    'user123',
    {
      customerId: 123,
      isVip: true
    }
  )

  if (isEnabled) {
    next();
  }
}, CreatorRouter)
```

source code in : /functions/api.js

The screenshots of the optimizely-express:

- audience

![][optimize_audience]

- feature

![][optimize_production]

[swagger_one]: ./img/swagger_one.png
[swagger_two]: ./img/swagger_two.png
[helmet]: ./img/Helmet.png
[validator]: ./img/validator.png
[recommendator]: ./img/recommendator.png
[recommendator_result]: ./img/recommendator_result.png
[Cors]: ./img/Cors.png
[serverless]: ./img/serverless.png
[netlify_cli]: ./img/netlify_cli.png
[optimize_express]: ./img/optimize_express.png
[netlify_overview]: ./img/netlify_overview.png
[netlify_staging_overview]: ./img/netlify_staging_overview.png
[netlify_staging_public]: ./img/netlify_staging_public.png
[netlify_staging_tvs]: ./img/netlify_staging_tvs.png
[netlify_staging_variables]: ./img/netlify_staging_variable.png
[netlify_production_overview]: ./img/netlify_production_overview.png
[netlify_production_public]: ./img/netlify_production_public.png
[netlify_production_tvs]: ./img/netlify_production_tvs.png
[netlify_production_variables]: ./img/netlify_production_variable.png
[heroku_overview]: ./img/heroku_overview.png
[heroku_swagger]: ./img/heroku_swagger.png
[optimize_audience]: ./img/optimize_audience.png
[optimize_production]: ./img/optimize_production.png