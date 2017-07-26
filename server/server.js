var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var { mongoose } = require('../db/mongoose');
var { Todo} = require('./../models/todo');
var { User } = require('./../models/user');

var {ObjectId} = require('mongodb');

var app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    title: req.body.title
  })

  todo.save().then(
    (doc) => { res.send(doc) },
    (err) => { res.sendStatus(400).send(err) })
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos: todos});
  }, (err) => {
    res.sendStatus(400).send(err);
  })
});

app.get('/todos/:id', (req, res) => {

  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    res.sendStatus(404).send();
  }
  console.log(req.params)
  Todo.findById(id).then((todo) => {
    if(!todo) {
      res.sendStatus(404).send()
    }
    res.send({todo: todo})
  }, (err) => {
    res.sendStatus(404).send(err);
  })
});

app.listen(3000, () => {
  console.log('exprss started on port 3000');
});

module.exports = { app }
