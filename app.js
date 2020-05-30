var express 				= require('express'),
	app 					= express(),
	bodyParser 				= require("body-parser"),
	mongoose 				= require('mongoose'),
	Campground 				= require('./models/campground'),
	Comment					= require('./models/comment'),
	seed					= require('./models/seed'),
	User 					= require('./models/user'),
	flash					= require('connect-flash'),
	passport				= require('passport'),
	localStrategy 			= require('passport-local'),
	passportLocalMongoose	= require('passport-local-mongoose'),
	methodOverride			= require('method-override');



var commentRoutes = require('./routes/commentRoutes'),
	loginRoutes	  = require('./routes/loginRoutes'),
	campgroundRoutes = require('./routes/campgroundRoutes');


mongoose.connect("mongodb+srv://userx:pass123@yelcamp-zbog0.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true});


// mongoose.connect('mongodb://localhost:27017/YelpCamp',{useNewUrlParser: true, useUnifiedTopology: true});


var db = mongoose.connection;

db.on('error', console.error.bind(console,"connection error: "));

db.once('open', function() {
	console.log('Connected to Database');
});

app.set("view engine","ejs");

app.use(express.static('Public'));

app.use(bodyParser.urlencoded({extended: true}));

app.use(require('express-session')({
	secret: "Secret string for session handling",
	resave: false,
	saveUninitialized: false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(loginRoutes);
app.use(campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);

app.listen(process.env.PORT || 3000, process.env.IP);

app.use(methodOverride("_method"));

// seed();

app.use(function(req,res,next){
	res.locals.user = req.user;
	res.locals.errorMessage = req.flash('error');
	next();
});

