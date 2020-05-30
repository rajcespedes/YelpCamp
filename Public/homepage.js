var photos = ['background1','background2','background3','background4'];

$('img').addClass(photos[0]);


var progressiveOpacity;

var photosIndex = 0;


setInterval(function(){

	setTimeout(function(){

		progressiveOpacity = 0;

		photosIndex += 1;

			$('body').append(`<img style="opacity: 0">`);   	

			$(`img:last`).addClass(photos[photosIndex]);

			var backgroundInterval = setInterval(function(){
				
				$(`img:last`).css('opacity',progressiveOpacity);
				progressiveOpacity += .04;

				if(progressiveOpacity >= 1) {
					clearInterval(backgroundInterval);
				}

				if(photosIndex  >= 3) {
					photosIndex = -1;
				}

			}, 140);

		var check = $('img');
		console.log(check);

		if(check.length > 3) {
			$('img:first').remove();
		}
		

	},750);

},3750);





