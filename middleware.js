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
				if(founded.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash('error','You are not allowed to do that');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error','You are not allowed to do that');
		res.redirect('/campgrounds/' + req.params.id);
	}
};

middlewareObj.checkIfAuthCamp = function (req,res,next){
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id,function(error,founded){
			if(error){
				req.flash('error',error);
				res.redirect('/campgrounds');
			} else {
				if(founded.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash('error','You are not allowed to do that');
					res.redirect('/campgrounds/' + req.params.id);
				}
			}
		});
	} else {
		req.flash('error','You are not allowed to do that');
		res.redirect('/campgrounds/' + req.params.id);
	}
};

middlewareObj.isLoggedIn = function (req,res,next) {
	if(req.isAuthenticated()){
		return next();
	}
	req.session.redirectTo = req.originalUrl;
	req.flash('error','Please, log in first');
	res.redirect('/login');
};


module.exports = middlewareObj;

