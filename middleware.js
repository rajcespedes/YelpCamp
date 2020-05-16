var Campground = require('./models/campground');
var Comment    = require('./models/comment');

var middlewareObj = {}


middlewareObj.checkIfAuthComment = function (req,res,next){
	if(req.isAuthenticated()) {
		Comment.findById(req.params.commentId,function(error,founded){
			if(error){
				res.redirect('/campgrounds');
			} else {
				console.log(founded);
				if(founded.author.id.equals(req.user._id)){
					next();
				} else {
					res.send('YOU ARE NOT ALLOWED TO DO THAT');
				}
			}
		});
	} else {
		res.send('YOU ARE NOT ALLOWED TO DO THAT');
	}
};

middlewareObj.checkIfAuthCamp = function (req,res,next){
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id,function(error,founded){
			if(error){
				res.redirect('/campgrounds');
			} else {
				console.log(founded);
				if(founded.author.id.equals(req.user._id)){
					next();
				} else {
					res.send('YOU ARE NOT ALLOWED TO DO THAT');
				}
			}
		});
	} else {
		res.send('YOU ARE NOT ALLOWED TO DO THAT');
	}
};

middlewareObj.isLoggedIn = function (req,res,next) {
	if(req.isAuthenticated()){
		return next();
		console.log('this shit ran');
	}
	res.redirect('/login');
};


module.exports = middlewareObj;

