'use strict';

const express = require('express')
require('dotenv').config()
const app = express()
require('ejs')
const superagent = require('superagent')
const client = require('./lib/client')
var methodOverride = require('method-override')

const PORT = process.env.PORT || 3001;
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded ({ extended: true, }));
app.use(methodOverride('_method'));

app.get('/', getTrending);
// app.post('/searches', getBookInfo);
// app.get('/searches/new', getForm);
// app.post('/', insertIntoDatabase);
// app.get('/books/:book_isbn', getOneBook);
// app.put('/books/updatebook', updateBook);
// app.delete('/delete/deletebook', deleteBook);

// app.get('/', function(req, res) {
//   res.render('pages/searches/show');
// });

// function getForm(request, response){
//   response.render('pages/searches/new');
// }

function getTrending(request, response){

  let url = `api.giphy.com/v1/gifs/trending?api_key=${process.env.GIPHYAPIKEY}`;
  // let typeOfSearch = request.body.search[1];
  // let searchCriteria = request.body.search[0];

  // if(typeOfSearch === 'author'){
  //   url += `+inauthor:${searchCriteria}`;
  // }

  // if(typeOfSearch === 'title'){
  //   url += `+intitle:${searchCriteria}`;
  // }

  superagent.get(url)
    .then(res => {
      let gifsArray = [];
      for (let i = 0; i < Object.keys(res.body.data).length; i++){
        gifsArray.push(res.body.data[i]);
      }
      let gifsList = gifsArray.map(gif => {
        return new Gifs(gif);
      });
      response.render('pages/searches/show', {gifsList: gifsList});
    })
    .catch(error => {
      console.log(error);
      response.render('pages/error');
    });
}

// function getBooks(request, response){
//   let sql = 'SELECT * FROM books;';
//   client.query(sql)
//     .then(results => {

//       let bookObjectArray = results.rows;
//       if(bookObjectArray.length){
//         response.render('pages/index', {bookArray: bookObjectArray});
//       }
//       else{
//         response.render('pages/searches/new');
//       }
//     })
//     .catch(error => {
//       console.log(error);
//       response.render('pages/error');
//     });
// }

// function getOneBook(request, response){
//   let id = request.params.book_isbn;
//   let sql = 'SELECT * FROM books WHERE isbn = $1;';
//   let safeValues = [id];

//   client.query(sql, safeValues)
//     .then(results => {
//       let chosenBook = results.rows[0];
//       response.render('pages/details', {book:chosenBook});
//     });
//   // go to the database, get a specific task using the id of that task and show the details of that task on the detail.ejs page
// }

// function insertIntoDatabase(request, response){
//   let sql = 'INSERT INTO books (authors, title, isbn, image_url, description, bookshelf) VALUES ($1, $2, $3, $4, $5, $6);';
//   let safeValues = [request.body.book[1], request.body.book[0], request.body.book[2], request.body.book[3], request.body.book[5], request.body.book[4]];

//   client.query(sql, safeValues);

//   response.redirect('/');
// }

// function updateBook(request, response){
//   let {authors, title, isbn, image, description, bookshelf} = request.body;

//   let sql = 'UPDATE books SET authors=$1, title=$2, isbn=$3, image_url=$4, description=$5, bookshelf=$6 WHERE isbn=$7;';

//   let safeValues = [authors, title, isbn, image, description, bookshelf, isbn];

//   client.query(sql, safeValues);

//   response.redirect(`/books/${isbn}`);
//   // redirect to the detail page with the new information
// }

// function deleteBook(request, response){
//   let sql = `DELETE FROM books WHERE isbn = $1;`;
//   let isbn = request.body.isbn;
//   let safeValues = [isbn];

//   client.query(sql, safeValues)
//     .then(() => {
//       response.redirect('/');
//     })
//     .catch(error => {
//       handleError(error, response);
//     });
// }

function Gifs(gifObj){
  const placeholderImage = `https://i.imgur.com/J5LVHEL.jpg`;
  gifObj.images.original.url !== null ? this.image_url = gifObj.images.original.url : this.image = placeholderImage;
  // this.image.substring(0,5) != 'https'? this.image = this.image.substring(0,4) + 's' + this.image.substring(4, this.image.length): this.image;
  gifObj.title !== null ? this.title = gifObj.title : this.title = 'no title available';
  gifObj.username !== null ? this.username = gifObj.username : this.username = 'no user available';
  gifObj.id !== null ? this.id = gifObj.id : this.id = 'no id available';
  gifObj.rating !== null ? this.rating = gifObj.rating : this.rating = 'no rating available';
  gifObj.url !== null ? this.url = gifObj.url : this.url = 'no url available';
}

function handleError(request, response, error) {
  console.error(error);
  response.status(404).render('pages/error');
}

// function queryError(error, response) {
//   console.error(error);
//   response.render('pages.error').status(503);
// }

// app.get('*', (request, response) => {
//   response.status(404).render('pages/error');
// });

client.connect()
  .then( () => {
    app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
  })
  .catch( err => console.error(err));
