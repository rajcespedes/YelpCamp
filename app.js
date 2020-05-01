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



var commentRoutes = require('./routes/commentRoutes'),
	loginRoutes	  = require('./routes/loginRoutes'),
	campgroundRoutes = require('./routes/campgroundRoutes');


//ROUTE IMPORTS


	// isLoggedIn 	  = require('./middleware');


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


app.use(loginRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(3000);


app.use(function(req,res,next){
	res.locals.user = req.user;
	next();
});


// LOGIN RELATED ROUTES

// COMMENT RELATED ROUTES


// CAMPGROUNDS RELATED ROUTES