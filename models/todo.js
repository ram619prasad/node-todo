// var { mongoose } = require('../db/mongoose');
var mongoose = require('mongoose')

var todoSchema = mongoose.Schema({
  title: {type: String, required: true, trim: true, minlength: 1},
  completed: {type: Boolean, default: false},
  completedAt: {type: Number, default: null}
});

var Todo = mongoose.model('Todo', todoSchema);

module.exports = { Todo }
