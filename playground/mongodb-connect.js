var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/todo_test';

MongoClient.connect(url, (err, db) => {
  if(err) {
    return console.log('Unable to connect to mongodb server');
  }
  console.log('connected to mongodb');

  db.collection('Todos').insertOne({title: 'Learn Node', completed: false},
    (err, r) => {
      if(err) { return console.log(err); }
      console.log(r);
  });

  db.close();
});
