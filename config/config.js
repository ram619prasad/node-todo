const env = process.env.NODE_ENV || 'development';

console.log('env >>>>>>', env);

if(env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_HOST = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_HOST = 'mongodb://localhost:27017/TodoAppTEST';
} else {
  process.env.MONGODB_HOST = 'mongodb://ram619prasad:Maddiram04031990@ds127063.mlab.com:27063/todo-api'
}
