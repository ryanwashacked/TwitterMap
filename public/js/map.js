var Map = function(opts) {

	opts.lat = opts.lat || 17.7850;
	opts.lng = opts.lng || -12.4183;
	opts.mapElem = opts.mapElem || "map_canvas";

	var heatMap,
			liveTweets,
			map;

	initMap = function() {
		var myLatlng = new google.maps.LatLng(opts.lat, opts.lng);

		var light_grey_style = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];

		var myOptions = {
			zoom: 2,
			center: myLatlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: true,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
				position: google.maps.ControlPosition.LEFT_BOTTOM
			},
			styles: light_grey_style
		};

		map = new google.maps.Map(document.getElementById(opts.mapElem), myOptions);
		liveTweets = new google.maps.MVCArray();
		heatMap = new google.maps.visualization.HeatmapLayer({
			data: liveTweets,
			radius: 25
		});
		heatMap.setMap(map);
	}

	addMarker = function(data) {
		//Add tweet to the heat map array.
		var tweetLocation = new google.maps.LatLng(data.lng,data.lat);
		liveTweets.push(tweetLocation);

		//Flash a dot onto the map quickly
		var image = "css/small-dot-icon.png";
		var marker = new google.maps.Marker({
			position: tweetLocation,
			map: map,
			icon: image
		});
		setTimeout(function(){
			marker.setMap(null);
		},600);
	}

	clearHeatMap = function() {
		heatmap.setMap(null)
	}

	return {
		initMap      : initMap,
		addMarker    : addMarker,
		clearHeatMap : clearHeatMap
	}

}


