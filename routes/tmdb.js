var restify = require('restify');
var request = require('request');
var Users = require('../models/user');
var fs = require('fs');
var youtubedl = require('youtube-dl');
var Verify = require('./verify');
module.exports = function(server){
server.post('/search', function(req, res) {
  var keyword = req.body;
 
  var requestSearch = 'http://api.themoviedb.org/3/search/movie?&api_key=5e7c67dc92a8469124e97038b3422c88&query='+ keyword;
  console.log(requestSearch);
  request(requestSearch,
    function(error, response, body){
      if(response.statusCode == 200) {
        res.send(body);
      } else {
        console.log(error);
      }
    });
});
server.post('/upcoming', function(req, res) {
    var requestUpComing = 'http://api.themoviedb.org/3/movie/upcoming?page=1&api_key=5e7c67dc92a8469124e97038b3422c88';
  console.log(requestUpComing);
  request(requestUpComing,
    function(error, response, body){
      if(response.statusCode == 200) {
        res.send(body);
      } else {
        console.log(error);
      }
    });
});

server.post('/upcoming/:page', function(req, res) {
  var value= req.params.page;
  var requestUpComing = 'http://api.themoviedb.org/3/movie/upcoming?page='+value+'&api_key=5e7c67dc92a8469124e97038b3422c88';
  console.log(requestUpComing);
  request(requestUpComing,
    function(error, response, body){
      if(response.statusCode == 200) {
        res.send(body);
      } else {
        console.log(error);
      }
    });
});
server.post('/movie/:id', function(req, res) {
  var id= req.params.id;
  var requestUpComing = "http://api.themoviedb.org/3/movie/" + id + "?api_key=a7f4e7531c0abfef4ade0b794873f5ce";
  console.log(requestUpComing);
  request(requestUpComing,
    function(error, response, body){
      if(response.statusCode == 200) {
        res.send(body);
      } else {
        console.log(error);
      }
    });
});
server.post('/trailer/:id', function(req, res) {
  var id= req.params.id;
  var getUrl = "http://api.themoviedb.org/3/movie/" + id + "/videos?api_key=a7f4e7531c0abfef4ade0b794873f5ce";
    console.log(getUrl);
  request(getUrl,
    function(error, response, body){
      if(response.statusCode == 200) {
        res.send(body);
      } else {
        console.log(error);
      }
    });
});
server.post('/videoStream/:videoUrl', function(req, res) {
  var videoUrl= req.params.videoUrl;
    var video = youtubedl("https://www.youtube.com/embed/"+videoUrl);
  console.log(requestUpComing);
video.on('info', function(info) {
  console.log('Download started');
  console.log('filename: ' + info.filename);
  console.log('size: ' + info.size);
});

video.pipe(fs.createWriteStream(videoUrl+'.mp4'));
    res.send("ok");
}); 
    
 server.post('rating/:rating/:movie/:user', (req, res) => {
	var user = req.params.user;
    var movie = req.params.movie; 
	var rating = req.params.rating;
    Users.findOne({'username': user})
        .populate('movierating.postedBy')
        .exec(function (err, ratingModel) {
     if (!ratingModel) {
			ratingModel = new Rating (
				{rating: 0, moviename: movie}
			);
     }
        ratingModel.rating = (ratingModel.rating * ratingModel.count + parseInt(rating))/(++(ratingModel.count));
		ratingModel.save();
		res.send (200, Math.round(ratingModel.rating));
    });
});

server.get('rating/:user', (req, res) => {
	var user = req.params.user; 	

	User.findOne({'username': user}) .populate('movierating.postedBy')
        .exec(function (err, ratingModel) {
		res.send (200, ratingModel ? Math.round(ratingModel.rating) : 0);		
    });
    
                       });
}

/**
 * Created by HIEPA on 23.11.2016.
 */

