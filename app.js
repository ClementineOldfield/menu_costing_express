const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require("cors");
const session = require('express-session');

const whitelist = [
  "http://localhost:3000"
]

app.use(cors({
  origin: (origin, callback) => {
    if(whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    }
    // create `DEV_TESTING` variable in env to allow tests through cors.
    // WARNING: DO NOT CREATE THIS ENV VARIABLE ON PRODUCTION
    else if(process.env.DEV_TESTING){
      callback(null, true);
    }
    else {
      callback(new Error('Not allowed. Blocked by CORS.'));
    }
  }
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({ 
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false
}));

app.use(morgan('combined'));

app.use(require('./routes'));

app.use(express.static('public'));

require('./database/connect');

module.exports = app;
