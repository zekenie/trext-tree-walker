var trextComponents = require('trext-components')
var Tree = trextComponents.Tree;
var Node = trextComponents.Node;

var tree = new Tree({
  name:'cats tree'
});

var catsQ = new Node({
  name: 'cats',
  text: 'do you like cats'
});

var yesCats = new Node({
  name: 'yesResp',
  text: 'I like cats too! what is your favorite color?',
  media: 'http://masspictures.net/wp-content/uploads/2014/03/a-parasite-found-in-cats-could-be-manipulating-our-brains.jpg'
})

var noCats = new Node({
  name: 'noResp',
  text: 'I hate you.'
})

var colorNode = new Node({
  name:'color',
  text:'ok'
});

tree.addNode(catsQ,true)
tree.addNode(yesCats)
tree.addNode(noCats)
tree.addNode(colorNode)

catsQ.connect(yesCats,"yes")
catsQ.connect(noCats,"no")

yesCats.connect(colorNode,{
  comparator: 'otherwise'
});

module.exports = tree;