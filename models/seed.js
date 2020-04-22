var mongoose = require('mongoose'),
	Campground = require('./campground'),
	Comment = require('./comment');

function seed(){
	Campground.remove({},function(error,removed){
		if(error){
			console.log(error);
		} else {
			console.log("removed");
			Campground.create({
				name: "Camp Sierra",
				image: "https://www.elacampground.com/wp-content/uploads/2019/06/Ela-Campground-87-768x513.jpg",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod"
			},function(error,newCamp){
			if(error){
				console.log(error);
			} else {
				Comment.create({
					author: "Yomi Tsmo",
					text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod"
				}, function(error,comment){
					if(error){
						console.log(error);
					} else {
						newCamp.comment.push(comment);
						newCamp.save();
						console.log(newCamp);
					}
				});

		}
	});
		}
	});

	
}




module.exports = seed;
