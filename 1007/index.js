const express = require('express');
const app = express();

const books = [
  {name: 'alice', author: 'jin', description: '엘리스가 집안에서 난동을 부리는 책입니다.'}];


app.get('/', (req, res)=> {
  res.send(JSON.stringify(books));
});


app.get('/books/:id', (req, res) => {
  const id = req.params.id;
  const book = books.find((e) => e.id === id);
  if (book === undefined) {
    res.send({error: true, message: 'cannot find book'});
  } else {
    res.send(JSON.stringify(book));
  }
});


app.listen(3000);
