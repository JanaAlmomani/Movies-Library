DROP TABLE IF EXISTS moviesInfo;

CREATE TABLE IF NOT EXISTS moviesInfo (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    release_date VARCHAR(255),
    poster_path VARCHAR(255),
    overview  VARCHAR(1000),
    commentText VARCHAR(1000)
);