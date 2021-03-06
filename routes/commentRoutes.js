var express 		= require('express'),
	router			= express.Router({mergeParams: true}),
	Campground 		= require('../models/campground'),
	Comment 		= require('../models/comment'),
	methodOverride 	= require('method-override'),
	bodyParser		= require('body-parser'),
	middleware		= require('../middleware');


router.use(methodOverride('_method'));


router.get('/new',middleware.isLoggedIn,function(req,res){
	res.render('newComment', {id: req.params.id});
});

router.get('/:commentId/edit',middleware.checkIfAuthComment,function(req,res){
	Campground.findById(req.params.id).populate('comment').exec(function(error,foundCamp){
		if(error){
			req.flash('error',error);
			res.redirect('/campgrounds/' + req.params.id);
		} else {
			Comment.findById(req.params.commentId,function(error,foundComment){
				if(error){
					req.flash('error',error);
					res.redirect('/campgrounds/' + req.params.id);
				} else {
					res.render('./comment/editComment',{
						camp: foundCamp, 
						comment: foundComment
					});
				}			
			});
		}

	});
	
});

router.put('/:commentId/edit',middleware.checkIfAuthComment,function(req,res){
	Campground.findById(req.params.id).populate('comment').exec(
		function(error,found){
			if(error) {
				req.flash('error',error);
				res.redirect('/campgrounds/' + req.params.id);
			} else {
				Comment.findByIdAndUpdate(req.params.commentId,
					{
						text: req.body.comment
					},function(error,toEdit){
					if(error) {
						req.flash('error',error);
					} else {
						req.flash('success','Comment edited!');
						res.redirect('/campgrounds/' + req.params.id);
					}
				});
			}

		});
	});

router.delete('/:commentId',middleware.checkIfAuthComment,function(req,res){
	Campground.findById(req.params.id,function(error,found){
		if(error) {
			console.log(error);
			res.redirect('/campgrounds/' + req.params.id);
		} else {
			console.log(req.params.commentId);
			Comment.findByIdAndRemove(req.params.commentId,function(error){
				if(error) {
					req.flash('error',error);
					res.redirect('/campgrounds/' + req.params.id);
				} else {
					req.flash('success','Comment deleted!');
					res.redirect('/campgrounds/' + req.params.id);
				}
			});
		}
	});
});


router.post('/',middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(error,foundCamp){
		if(!error) {
			Comment.create({
				text: req.body.comment
			},function(error,newComment){
				if(!error){
					newComment.author.id = req.user._id;
					newComment.author.username = req.user.username;
					newComment.save();
					foundCamp.comment.push(newComment);
					foundCamp.save();
					req.flash('success','Comment added!');
					res.redirect('/campgrounds/' + req.params.id);
				} else {
					req.flash('error',error);
					res.redirect('/campgrounds/' + req.params.id);
				}
			});
		}
	})
	
});

module.exports = router;