var bodyParser = require('body-parser');  // using body-parser to parse form
var mongoose = require('mongoose');   // mongoose for connecting to mongoDB

// connect to mlab mongodb
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test1:test1@127.0.0.1:27017/Todo'); // this line is for windows local mongodb
// mongoose.connect('mongodb://test1:test1@ds035806.mlab.com:35806/foobartodo'); // For mLab mongodb

// schema
var todoSchema = new mongoose.Schema({
  item: String
});

// create a model Todo for the app which use todoSchema and map to Todo collection in mongoDB
var Todo = mongoose.model('Todo', todoSchema);

var currentdate = new Date();
var datetime = currentdate.getDate() + "/"+ (currentdate.getMonth()+1) + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
console.log(datetime);

/* testing only, as this will add a new line of item into collection everytime this app runs
var itemTestOnly = Todo({item:datetime}).save(function(err){
  if (err) throw err;
  console.log('item saved.');
});   // test with one item, remove when roll-out
*/
// var data = [{item: 'get milk'},{item: 'walk dog'},{item: 'kick something'}];

var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function(app)
{

  app.get('/todo', function(req, res){
      // get data from mongoDB and pass it to the view
      Todo.find({}, function(err, data){
        if (err) throw err;
        res.render('todo', {todos: data});
      });
  });

  app.post('/todo', urlencodedParser, function(req, res){
      // get data fomr the view and add it to mongodb
      var newTodo = Todo(req.body).save(function(err, data){
        if (err) throw err;
        res.json(data);
      });
  });

  app.delete('/todo/:item', function(req, res){
      // delete the requested item from mongodb
      Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function (err,data){
        if (err) throw err;
        res.json(data);
      });
  });
}
