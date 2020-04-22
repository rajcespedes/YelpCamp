var express 	= require('express'),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require('mongoose'),
	Campground 	= require('./models/campground'),
	Comment		= require('./models/comment'),
	seed		= require('./models/seed');

mongoose.connect('mongodb://localhost:27017/YelpCamp',{useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console,"connection error: "));

db.once('open', function() {
	console.log('Connected to Database');
});

app.set("view engine","ejs");

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000);

// seed();

app.get("/",function(req,res){
	res.render("home");
});

app.get("/campgrounds",function(req,res){
	Campground.find({}, function(error,campground){
		if(error) {
			console.log(error);
		} else {
			console.log("NEWLY ADDED CAMPGROUND");
			res.render("index",{ campgrounds: campground});
		}
	});
	
});

app.get('/campgrounds/new',function(req,res) {
	res.render('newCampground');
});

app.post("/campgrounds", function(req,res){
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
				console.log('NEWLY CREATED CAMPGROUND');
				console.log(newCampground);
				res.redirect("/campgrounds");
		}
	});
	
	
});

app.get('/campgrounds/:id/comments/new',function(req,res){
	res.render('newComment', {id: req.params.id});
});

app.post('/campgrounds/:id/comments',function(req,res){
	Campground.findById(req.params.id,function(error,foundCamp){
		if(!error) {
			console.log(req.body.comment);
			Comment.create({
				author: req.body.author,
				text: req.body.comment
			},function(error,newComment){
				if(!error){
					foundCamp.comment.push(newComment);
					foundCamp.save();
					console.log(foundCamp);
					res.redirect('/campgrounds/' + req.params.id);
				}
			});
		}
	})
	
});

app.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate('comment').exec(function(error,foundCampground){
		if(error){
			console.log(error);
		} else {
			// console.log(foundCampground);
			res.render('show', {campground: foundCampground});
		}
	});
	
});