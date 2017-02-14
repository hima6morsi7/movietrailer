var restify = require('restify');
var app = restify.createServer({name: "restfulApp"});
var server_controller = require("./server-controller");
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config');
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("Connected correctly to server");
});
var serverController = new server_controller.ServerController();
app.use(restify.bodyParser());
app.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader('Access-Control-Allow-Methods', 'POST');  
    res.setHeader('Access-Control-Allow-Methods', 'GET');    
    return next();
  }
);
app.use(restify.queryParser());
app.get('/swagger.json', serverController.getFixedSwaggerJson.bind(serverController));
// serve public folder
app.get(/^(?!\/(movie)).*/, restify.serveStatic({
    directory: __dirname + '/public/',
    default: 'index.html'
}));
app.listen(3000, function () {
    console.log("app listening on port: 3000");
});
var routes = function(app) {
    require('./routes/tmdb')(app);
    require('./routes/users')(app);}(app);


/**
 * Created by Ibrahim on 11.02.2017.
 */


