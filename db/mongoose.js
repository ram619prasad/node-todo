const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_HOST, {useMongoClient: true});

mongoose.connect(process.env.MONGODB_HOST, { useMongoClient: true })

module.exports = { mongoose }
