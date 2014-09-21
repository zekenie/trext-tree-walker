var express = require('express');
var bodyParser = require('body-parser')
var twilioSession = require('twilio-session')
var twilio = require('twilio')
var treeWalker = require('./treeWalker')
var tree = require('./tree')
var app = express()

app.use(bodyParser())

app.use(function(req,res,next) {
  res.type('text/xml');
  next();
})

app.use(twilioSession({
  mongoURI: 'mongodb://localhost/twilioExample'
}));

app.use(function(req,res,next) {
  if(!req.phone.hasOwnProperty('state')) {
    req.phone.state = 'tree'
  }
  next();
})

app.use('/tree',treeWalker({
  tree: tree,
  onComplete: function(p) {
    p.state = 'numbers'
  }
}));

app.use('/numbers',function(req,res,next) {
  if(typeof req.phone.number === 'undefined') {
    req.phone.number = 0;
  }
  ++req.phone.number;
  var resp = new twilio.TwimlResponse();
  resp.message("" + req.phone.number);
  res.send(200, resp.toString());
})

app.use(function(req,res,next) {
  console.log('redirecting to /' + req.phone.state)
  res.redirect('/' + req.phone.state);
})

app.use(function(err, req, res, next) {
  console.log(err.stack);
  var resp = new twilio.TwimlResponse();
  resp.message(err.message)
  res.send(200, resp.toString())
});


module.exports = app;
app.listen(3000);