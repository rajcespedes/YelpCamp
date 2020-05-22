var Campground = require('./models/campground');
var Comment    = require('./models/comment');

var middlewareObj = {}


middlewareObj.checkIfAuthComment = function (req,res,next){
	if(req.isAuthenticated()) {
		Comment.findById(req.params.commentId,function(error,founded){
			if(error){
				req.flash('error',error);
				res.redirect('/campgrounds');
			} else {
				// console.log(founded);
				if(founded.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash('error','You are not allowed to do that');
					res.redirect('back');
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
	}
	req.flash('error','Please, log in first');
	res.redirect('/login');
};


module.exports = middlewareObj;

