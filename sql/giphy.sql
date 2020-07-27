-- DROP TABLE IF EXISTS books;

-- CREATE TABLE books (
--     id SERIAL PRIMARY KEY,
--     authors VARCHAR(255),
--     title VARCHAR(255),
--     isbn VARCHAR(255),
--     image_url VARCHAR(255),
--     description TEXT,
--     bookshelf VARCHAR(255)
--   );
  
DROP TABLE IF EXISTS GIFS;

CREATE TABLE gifs (
    id SERIAL PRIMARY KEY,
    image_url VARCHAR(255),
    gif_url VARCHAR(255),
    username VARCHAR(255),
    title VARCHAR(255),
    rating VARCHAR(255)
)