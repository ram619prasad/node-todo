const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp', {useMongoClient: true});

mongoose.connect('mongodb://ram619prasad:Maddiram04031990@ds127063.mlab.com:27063/todo-api' || 'mongodb://localhost:27017/TodoApp')

module.exports = { mongoose }
