var mongoose = require('mongoose'),
	Campground = require('./campground'),
	Comment = require('./comment');

function seed(){
	Campground.remove({},function(error,removed){
		if(error){
			console.log(error);
		} else {
			console.log("removed");
		}
	});
	Comment.remove({},function(error){
		if(!error) {
			console.log('removed');
		}
	});

	
}




module.exports = seed;
