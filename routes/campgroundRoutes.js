var express 		= require('express'),
	router			= express.Router({mergeParams: true}),
	Campground 		= require('../models/campground'),
	bodyParser		= require('body-parser'),
	methodOverride 	= require('method-override'),
	middleware		= require('../middleware');


router.use(methodOverride("_method"));

router.use(function(req,res,next){
	res.locals.user = req.user;
	next();
});

// function isLoggedIn(req,res,next) {
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect('/login');
// }
 
router.get("/",function(req,res){
	// $('body').css('background-color','green');
	res.render("home");
});

router.get("/campgrounds",middleware.isLoggedIn,function(req,res){
	Campground.find({}, function(error,campground){
		if(error) {
			console.log(error);
		} else {
			res.render("index",
			{ 
				campgrounds: campground,
				user: req.user
			});
		}
	});
});


router.get('/campgrounds/new',middleware.isLoggedIn,function(req,res) {
	res.render('newCampground');
});

router.post("/campgrounds", function(req,res){
	Campground.create(
		{ 
		  name: req.body.campName, 
		  image: req.body.imageUrl, 
		  description: req.body.description
		}, 
		function(error,newCampground) {
			if(error){
				console.log(error);
			} else {
				newCampground.author.id = req.user._id;
				newCampground.author.username = req.user.username;
				newCampground.save();
				console.log(newCampground);
				res.redirect("/campgrounds");
		}
	});	
});

router.get('/campgrounds/:id/edit',middleware.checkIfAuthCamp,function(req,res){
	Campground.findById(req.params.id,function(error,foundCamp){
		if(!error) {
			res.render('edit',{ campground: foundCamp, id: req.params.id});
		}
	});
});

router.put('/campgrounds/:id',middleware.checkIfAuthCamp,function(req,res){
	var editCamp = {
		name: req.body.campName,
		image: req.body.imageUrl,
		description: req.body.description
	};
	Campground.findByIdAndUpdate(req.params.id,editCamp,function(error,editCamp){
		if(!error) {
			res.redirect('/campgrounds/' + req.params.id);
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

router.delete('/campgrounds/:id',middleware.checkIfAuthCamp,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(error){
		if(error) {
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds');
		}
	});
});

router.get("/campgrounds/:id",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id).populate('comment').exec(function(error,foundCampground){
		if(error){
			console.log(error);
		} else {
			console.log(foundCampground);
			res.render('show', {campground: foundCampground});
		}
	});
	
});

module.exports = router;