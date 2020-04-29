var express 				= require('express'),
	app 					= express(),
	bodyParser 				= require("body-parser"),
	mongoose 				= require('mongoose'),
	Campground 				= require('./models/campground'),
	Comment					= require('./models/comment'),
	// seed					= require('./models/seed'),
	User 					= require('./models/user'),
	passport				= require('passport'),
	localStrategy 			= require('passport-local'),
	passportLocalMongoose	= require('passport-local-mongoose');



var commentRoutes = require('./routes/commentRoutes');

function isLoggedIn(req,res,next) {
	if(req.isAuthenticated()){
		console.log(req.isAuthenticated());
		return next();
	}
	res.redirect('/login');
}

//ROUTE IMPORTS


	// isLoggedIn 	  = require('./middleware');

app.use(commentRoutes);
// app.use(middleware);

mongoose.connect('mongodb://localhost:27017/YelpCamp',{useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console,"connection error: "));

db.once('open', function() {
	console.log('Connected to Database');
});

app.set("view engine","ejs");

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

app.use(require('express-session')({
	secret: "Secret string for session handling",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(3000);


app.use(function(req,res,next){
	res.locals.user = req.user;
	next();
});



app.get("/",function(req,res){
	res.render("home");
});

app.get("/campgrounds",isLoggedIn,function(req,res){
	console.log(req.user.username);
	Campground.find({}, function(error,campground){
		if(error) {
			console.log(error);
		} else {
			res.render("index",
			{ 
				campgrounds: campground,
				user: req.user.username
			});
		}
	});
	
});

// LOGIN RELATED ROUTES

app.get('/login',function(req,res){
	res.render('login');
});

app.post('/login',passport.authenticate("local",{
	successRedirect: '/campgrounds',
	failureRedirect: '/login'
}),function(req,res){
	
});

app.get('/logout',function(req,res){
	req.logout();
	res.redirect('/');
});

app.get('/register',function(req,res){
	res.render('register');
});

app.post('/register',function(req,res){
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

// COMMENT RELATED ROUTES



// CAMPGROUNDS RELATED ROUTES


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
				console.log(newCampground);
				res.redirect("/campgrounds");
		}
	});	
});

app.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate('comment').exec(function(error,foundCampground){
		if(error){
			console.log(error);
		} else {
			res.render('show', {campground: foundCampground});
		}
	});
	
});