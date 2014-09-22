var twilio = require('twilio')

var error = function(n) {
  return 'Sorry, the options are ' + n.optionsStr()
}

module.exports = function(config) {
  return [

    //setup tree obj if it doesn't exist
    function(req,res,next) {
      if(!req.phone.hasOwnProperty(config.tree.name))
        req.phone[config.tree.name] = {
          data:{}
        };
      next();
    },

    //setup shortcut to req.phone[tree] on req obj
    function(req,res,next) {
      req.treeState = req.phone[config.tree.name];
      next();
    },

    //set initial state if there isn't one
    function(req,res,next) {
      if(req.treeState.hasOwnProperty('state')) return next();
      req.treeState.state = config.tree.startingPoint.name;
      req.node = config.tree.startingPoint
      req.treeStart = true
      next();
    },

    //save the response
    function(req,res,next) {
      req.treeState.data[req.treeState.state] = req.body.Body;
      next();
    },

    //figure out where to go next
    function(req,res,next) {
      //move on if first text
      if(req.treeStart) return next();
      var nextNode = config.tree.nodes[req.treeState.state].next(req.body.Body)
      if(!nextNode)
        return next(new Error(error(config.tree.nodes[req.treeState.state])))
      req.node = nextNode;
      req.treeState.state = req.node.name
      next();
    },

    function(req,res,next) {
      var resp = new twilio.TwimlResponse();
      resp.message(function() {
        this.body(req.node.text);
        if(req.node.media)
          this.media(req.node.media);
      });
      req.str = resp.toString();
      console.log(req.str);
      next();
    },

    function(req,res,next) {
      if(req.node.connections.length === 0) {
        delete req.treeState.state
        if(typeof config.onComplete === 'function')
          config.onComplete(req.phone);
      }
      next();
    },

    function(req,res,next) {
      res.send(req.str);
    }
  ]
}