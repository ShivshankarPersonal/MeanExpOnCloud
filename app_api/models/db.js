var mongoose = require('mongoose');
var gracefulShutdown;
var dbURI = process.env.CUSTOMCONNSTR_MONGOLAB_URI;
//var dbURI = 'mongodb://MongoLab-h:hRX9QyYO_woaRphjhwP3dj9YG4OsEfdFbz.m6Q94Maw-@ds042128.mongolab.com:42128/MongoLab-h';
//var dbURI = 'mongodb://localhost/meanAuth';
//var dbURI = "mongodb://shiv:shiv@ds047865.mongolab.com:47865/meantest";
//var dbURI = 'mongodb://localhost/meanAuth';
if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI);

// CONNECTION EVENTS
mongoose.connection.on('connected', function() {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};
// For nodemon restarts
process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function() {
    process.kill(process.pid, 'SIGUSR2');
  });
});
// For app termination
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function() {
    process.exit(0);
  });
});
// For Heroku app termination
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app termination', function() {
    process.exit(0);
  });
});

// BRING IN YOUR SCHEMAS & MODELS
require('./users');