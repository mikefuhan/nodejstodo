var bodyParser = require('body-parser');  // using body-parser to parse form
var mongoose = require('mongoose');   // mongoose for connecting to mongoDB

// connect to mlab mongodb
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test1:test1@127.0.0.1:27017/Todo');

// schema
var todoSchema = new mongoose.Schema({
  item: String
});

// create a model Todo for the app which use todoSchema and map to Todo collection in mongoDB
var Todo = mongoose.model('Todo', todoSchema);

var currentdate = new Date();
var datetime = currentdate.getDate() + "/"+ (currentdate.getMonth()+1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
console.log(datetime);

var itemTestOnly = Todo({item:datetime}).save(function(err){
  if (err) throw err;
  console.log('item saved.');
});   // test with one item, remove when roll-out



var data = [{item: 'get milk'},{item: 'walk dog'},{item: 'kick something'}];

var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function(app)
{

  app.get('/todo', function(req, res){
      res.render('todo', {todos: data});
  });

  app.post('/todo', urlencodedParser, function(req, res){
      data.push(req.body); // add the new item into this array
      res.json(data);      // send this thing back as json to the front-end
  });

  app.delete('/todo/:item', function(req, res){
      data = data.filter(function(todo){
        return todo.item.replace(/ /g, '-') !== req.params.item; // when this returns false, it will filter this item out from the array.
      });
      res.json(data);
  });
}
