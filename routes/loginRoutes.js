var express = require('express'),
	router 	= express.Router({mergeParams: true}),
	passport = require('passport'),
	User 	 = require('../models/user'),
	localStrategy = require('passport-local');


router.use(function(req,res,next){
	res.locals.user = req.user;
	next();
});


router.get('/login',function(req,res){
	res.render('login');
});

router.post('/login',passport.authenticate("local",{
	successRedirect: '/campgrounds',
	failureRedirect: '/login'
}),function(req,res){
	
});

router.get('/logout',function(req,res){
	req.logout();
	res.redirect('/');
});

router.get('/register',function(req,res){
	res.render('register');
});

router.post('/register',function(req,res){
	User.register(new User({ username: req.body.username }), 
		req.body.password, function(error,user){
		// console.log(user);
		if(error) {
			console.log(error);
			res.redirect('/register');
		}
		passport.authenticate("local")(req,res,function(){

			res.redirect('/campgrounds');
		});
	});
});

module.exports = router;