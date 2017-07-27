const expect = require('expect');
const request = require('supertest');
var { ObjectID } = require('mongodb');

var { app } = require('./../server/server');
var { Todo } = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  title: 'First test todo'
}, {
  _id: new ObjectID(),
  title: 'Second test todo',
  completed: true,
  completedAt: 3456
}];


beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', (todo) => {

  it('creates a todo', (done) => {
    var title = 'Test todo';

    request(app)
      .post('/todos')
      .send({title})
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe(title)
      })
      .end((err, res) => {
        if(err) { return done(err) };

        Todo.find({title: title}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].title).toBe(title);
          done();
        }).catch((err) => {
          done(err);
        });
      });
  });

  it('should not create todo without title', (done) => {

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) { return done(err); }

        Todo.find({}).then((todos) => {
          expect(todos.length).toBe(2)
          done();
        }).catch((e) => {
          done(e);
        })
      });
  });
});



describe('GET /todos', () => {

  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .end((err, res) => {
        if(err) { return done(err); }
        expect(res.body.todos.length).toBe(2);
        done();
      })
  });
})

describe('GET /todos/:id', () => {

  it('should return a todo', (done) => {
    request(app)
      .get(`/todos/todos[0]._id.toHexString()`)
      .expect(200)
      .expect((res) => {
        console.log(res.body.todo.title).toBe(todos[0].title);
      })
      .end(done());

  });

  it('should return 404', (done) => {
    request(app)
      .get(`/todos/1234adba`)
      .expect(404)
      .end(done());

  });

  it('should return 404 with invalid id', (done) => {
    var id = new ObjectID().toHexString()
    request(app)
      .get(`/todos/id`)
      .expect(404)
      .end(done());
  });
});

describe('DELETE /todos/:id', () => {

  it('should delete a todo', (done) => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.findById(todos[0]._id.toHexString()).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => { done(e) });
      })
  });

  it('should return 404 with invalid id', (done) => {
    request(app)
      .delete(`/todos/123`)
      .expect(404)
      .end(done())
  });


  it('should return 404', (done) => {
    var id = new ObjectID().toHexString()
    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done())
  })
});

describe('PATCH /todos/:id', () => {

  it('should return 404 with invalid id', (done) => {
    request(app)
      .patch(`/todos/123`)
      .expect(404)
      .end(done())
  });

  it('should return 404', (done) => {
    var id = new ObjectID().toHexString()
    request(app)
      .delete(`/patch/${id}`)
      .expect(404)
      .end(done())
  })

  it('should update when changes are there', (done) => {
    var id = todos[0]._id.toHexString();

    body = { title: 'something new', completed: true}

    request(app)
      .patch(`/todos/${id}`)
      .send(body)
      .expect(200)
      .end((err, res) => {
        if(err) {
          return done(e);
        }

        Todo.findById(id).then((todo) => {
          expect(todo.title).toBe(body.title)
          expect(todo.completed).toBe(body.completed)
          expect(todo.completedAt).toBeA('number')
          return done()
        }).catch((e) => { return done(e)})
      })
  });

  it('should update completedAt to be nil when completed is false', (done) => {
    var id = todos[1]._id.toHexString();
    var text = 'This should be the new text!!';
    var body = {title: text, completed: false}

    request(app)
      .patch(`/todos/${id}`)
      .send(body)
      .expect(200)
      .end((err, res) => {
        if(err) { return done() }
        Todo.findById(id).then((todo) => {
          expect(todo.title).toBe(text)
          expect(todo.completed).toBe(false)
          expect(todo.completedAt).toNotExist()
          done()
        }).catch((e) => { return done(e)})
      })
  });
});
