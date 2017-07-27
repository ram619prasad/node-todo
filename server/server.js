require('./../config/config');

console.log('port', process.env.PORT);
console.log('db host', process.env.MONGODB_HOST);

var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
const _ = require('lodash');

var { mongoose } = require('../db/mongoose');
var { Todo} = require('./../models/todo');
var { User } = require('./../models/user');

var {ObjectId} = require('mongodb');

var app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT;

app.post('/todos', (req, res) => {
  var todo = new Todo({
    title: req.body.title
  })

  todo.save().then(
    (doc) => { res.send(doc) },
    (err) => { res.sendStatus(400).send(err) })
});

app.get('/todos', (req, res) => {
  console.log('coming')
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

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    res.sendStatus(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    console.log('id'+id);
    if(!todo) {
      res.sendStatus(404).send();
    }
    res.send({todo});
  }, (err) => {
    res.sendStatus(400).send(err);
  })

});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['title', 'completed']);

  if(!ObjectID.isValid(id)) {
    res.sendStatus(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completedAt = null
    body.completed = false
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
    .then((todo) => {
      if(!todo) {
        res.sendStatus(404).send();
      }
      res.send({todo});
    }).catch((e) => {
      res.sendStatus(400).send();
    });
});

app.listen(PORT, () => {
  console.log(`Expres Server is running on port; ${PORT}`);
});

module.exports = { app }
