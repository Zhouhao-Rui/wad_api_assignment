import fetch from 'node-fetch';

export const getMovies = () => {
  return fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_KEY}&language=en-US&include_adult=false&page=1`
  )
    .then(res => res.json())
    .then(json => json.results);
};

export const getMovieByPage = (page) => {
  return fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_KEY}&language=en-US&include_adult=false&page=${page}`
  )
  .then(res => res.json())
  .then(json => json.results)
}

export const getMovie = id => {
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_KEY}`
  ).then(res => res.json());
};

export const getGenres = () => {
  return fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_KEY}&language=en-US`
  ).then(res => res.json())
    .then(json => json.genres);
};

export const getMovieReviews = id => {
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${process.env.TMDB_KEY}`
  )
    .then(res => res.json())
    .then(json => json.results);
};

export const getUpcomingMovies = (page) => {
  return fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_KEY}&language=en-US&page=${page}`
  )
  .then(res => res.json())
  .then(json => json.results)
}

export const searchMovies = (query_string) => {
  return fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_KEY}&language=en-us&query=${query_string}&page=1&include_adult=false`
  )
  .then(res => res.json())
  .then(json => json.results)
}