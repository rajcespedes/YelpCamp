var express 		= require('express'),
	router			= express.Router({mergeParams: true}),
	Campground 		= require('../models/campground'),
	bodyParser		= require('body-parser'),
	methodOverride 	= require('method-override'),
	middleware		= require('../middleware');


router.use(methodOverride("_method"));

router.get("/",function(req,res){
	res.render("home");
});

router.get("/campgrounds",function(req,res){
	Campground.find({}, function(error,campground){
		if(error) {
			req.flash('error',error);
			console.log(error);
		} else {
			console.log(req.route.path);
			res.render("index",
			{ 
				campgrounds: campground,
				user: req.user
			});
		}
	});
});


router.get('/campgrounds/new',middleware.isLoggedIn,function(req,res) {
	res.render('newCampground', { message: req.flash('error')});
});

router.post("/campgrounds", function(req,res){
	Campground.create(
		{ 
		  name: req.body.campName, 
		  image: req.body.imageUrl, 
		  description: req.body.description,
		  price: req.body.price
		}, 
		function(error,newCampground) {
			if(error){
				req.flash('error',error);
				console.log(error);
			} else {
				newCampground.author.id = req.user._id;
				newCampground.author.username = req.user.username;
				newCampground.save();
				req.flash('success', 'New campground added!');
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
		description: req.body.description,
		price: req.body.price
	};
	Campground.findByIdAndUpdate(req.params.id,editCamp,function(error,editCamp){
		if(!error) {
			req.flash('success','Campground edited!');
			res.redirect('/campgrounds/' + req.params.id);
		} else {
			req.flash('error',error);
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

router.delete('/campgrounds/:id',middleware.checkIfAuthCamp,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(error){
		if(error) {
			res.redirect('/campgrounds');
		} else {
			req.flash('success','Campground deleted!');
			res.redirect('/campgrounds');
		}
	});
});

router.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate('comment').exec(function(error,foundCampground){
		if(error){
			req.flash('error',error);
			console.log(error);
		} else {
			req.session.redirectTo = req.originalUrl;
			res.render('show', {campground: foundCampground});
		}
	});
	
});

module.exports = router;