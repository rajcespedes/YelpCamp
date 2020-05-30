var express = require('express'),
	router 	= express.Router({mergeParams: true}),
	passport = require('passport'),
	User 	 = require('../models/user'),
	localStrategy = require('passport-local');


router.use(function(req,res,next){
	res.locals.user = req.user;
	res.locals.errorMessage = req.flash('error');
	res.locals.successMessage = req.flash('success');
	next();
});

router.use(function(req,res,next){
	if(req.path != '/login' && req.session.redirectTo) {
		delete req.session.redirectTo;
	}
	next();
});


router.get('/login',function(req,res){
	res.render('login');
});


router.post('/login',function(req,res,next){
	passport.authenticate('local',{
		successRedirect: req.session.redirectTo || '/campgrounds',
		failureRedirect: '/login',
		failureFlash: true,
		successFlash: 'Welcome! ' + req.body.username
	})(req,res);
});

router.get('/logout',function(req,res){
	req.logout();
	req.flash('success','You just logged out');
	res.redirect('back');
});

router.get('/register',function(req,res){
	res.render('register');
});

router.post('/register',function(req,res){
	User.register(new User({ username: req.body.username }), 
		req.body.password, function(error,user){
		if(error) {
			req.flash('error',error.message);
			res.redirect('/register');
		} else {
			passport.authenticate("local")(req,res,function(){
				res.redirect('/campgrounds');
			});
		}
	});
});

module.exports = router;