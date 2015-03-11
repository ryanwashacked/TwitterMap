
TwitterStream = function() {

	if(io !== undefined) {
			// Storage for WebSocket connections
			var socket = io.connect('');
	}

	//Setup Google Map
	map = Map({mapElem: "map_canvas"});
	map.initMap();
  map.initHeatMap();

  //Setup heat map and link to Twitter array we will append data to

  var tweetsText = document.getElementById("actualTexT");
  var tweetTextContainer = document.getElementById("twitterText")

  // This listens on the "twitter-steam" channel and data is
  // received everytime a new tweet is receieved.
  socket.on('twitter-stream', function (data) {
    map.addMarker(data);
  });

  socket.on('twitter-stream-text', function(data){
    tweetsText.innerHTML = tweetsText.innerHTML + '<p class="text text-success">' + '<b style="color:red";>'+data.screen_name +' : </b>' + data.text +'</p>';
    tweetTextContainer.scrollTop = tweetTextContainer.scrollHeight;
  });

  // Listens for a success response from the server to
  // say the connection was successful.
  socket.on("connected", function(r) {
    console.log("We are connected to the server")
    //Now that we are connected to the server let's tell
    //the server we are ready to start receiving tweets.
    socket.emit("start tweets");
  });

  getResults = function() {
			map.clearHeatMap();
      var data = {
        "filter" : $("#filterInput").val(),
        "language" : $("#selectLanguage").val()
      }
      socket.emit("stop-stream");
			socket.emit("start tweets", data);
	}

	return {
		getResults : getResults
	}

}

