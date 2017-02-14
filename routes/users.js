var restify = require('restify');
var request = require('request');
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');
module.exports = function(router){
router.get('/',function (req, res, next) {
  User.find({}, function (err, user) {
    if (err) {
      return res.status(500).json({
        err: 'not enough privileges '
      });
    }
    res.json(user);
  });
});

router.post('/register', function (req, res) {
  User.register(new User({username: req.body.username}),
    req.body.password, function (err, user) {
      if (err) {
        return res.status(500).json({err: err});
      }
      if (req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      if (req.body.lastname) {
        user.lastname = req.body.lastname;
      }
      user.save(function (err, user) {
        passport.authenticate('local')(req, res, function () {
          return res.status(200).json({status: 'Registration Successful!'});
        });
      });
    });
});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
        console.log(err,info);
    }
    req.logIn(user, function (err) {
      if (err) {
        console.log(err);
      }
        console.log(err,user,info);
       var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});
    });
  })(req, res, next);
});

router.get('/logout', function (req, res) {
  req.logout();
  res.status(200).json({
    status: 'C ya!'
  });
});


}
