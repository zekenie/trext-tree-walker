var trextComponents = require('trext-components')
var Tree = trextComponents.Tree;
var Node = trextComponents.Node;

var tree = new Tree({
  name:'cats tree'
});


tree.addNode(new Node({
  name: 'cats',
  text: 'do you like cats'
}), true);

tree.addNode(new Node({
  name: 'yesResp',
  text: 'I like cats too! what is your favorite color?',
  media: 'http://masspictures.net/wp-content/uploads/2014/03/a-parasite-found-in-cats-could-be-manipulating-our-brains.jpg'
}))


tree.addNode(new Node({
  name: 'noResp',
  text: 'I hate you.'
}))

tree.connect('cats','yesResp','yes')
tree.connect('cats','noResp','no')

tree.addNode(new Node({
  name:'color',
  text:'ok'
}))

tree.connect('yesResp','color',{
  comparator: 'otherwise'
})

module.exports = tree;