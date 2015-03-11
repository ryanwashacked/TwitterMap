// Setup web server and socket
var twitter = require('twitter'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    port = 8081,
    io = require('socket.io').listen(server);

//Setup twitter stream api
var twit = new twitter({
        consumer_key: 'JmDmd7KGdTcrfY15Cgo89avF4',
        consumer_secret: 'USmTrPYNMNELqoPdQrJzgDzLCw4Lfm4yrjsq8IfxEMO56t6PjU',
        access_token_key: '1140441464-PRPMkmQuFvUtlbbVbCBcZqzOtEvPnKaM6eG4ga3',
        access_token_secret: 'yz1n4u8AU8SvbXPqzRsyWc5DqqpPSFFNfh8MWOYh9Pk6M'
    }),
    filter = '',
    language = 'en';
    twit.currentStream = null;
//Use the default port (for beanstalk) or default to 8081 locally
server.listen(process.env.PORT || port);
console.log('Your application is running on http://localhost:' + port);
//Setup rotuing for app
app.use(express.static(__dirname + '/public'));

//Create web sockets connection.
io.sockets.on('connection', function(socket) {

    socket.on("start tweets", function(data) {
        console.log("start tweets")
        console.log("============")
        console.log(data)
        console.log("============")        
        if (typeof data !== 'undefined') {
            twit.currentStream = null;
            language = data.language;
            filter = data.filter;
        }
        if ( twit.currentStream === null) {
            //Connect to twitter stream passing in filter for entire world.
            twit.stream('statuses/filter', {
                'locations': '-180,-90,180,90',
                'language': language,
                'filter': filter
            }, function(s) {
                stream = s;
                stream.on('data', function(data) {
                    // Does the JSON result have coordinates
                    if (data.coordinates) {
                        if (data.coordinates !== null) {
                            //If so then build up some nice json and send out to web sockets
                            var outputPoint = {
                                "lat": data.coordinates.coordinates[0],
                                "lng": data.coordinates.coordinates[1]
                            };

                            socket.broadcast.emit("twitter-stream", outputPoint);

                            //Send out to web sockets channel.
                            socket.emit('twitter-stream', outputPoint);

                            if (data.text) {
                                var textData = {
                                    "screen_name": data.user.screen_name,
                                    "text": data.text
                                }
                                socket.broadcast.emit("twitter-stream-text", textData)
                                socket.emit("twitter-stream-text", textData)
                            }
                        }
                    }
                });
                twit.currentStream = s;
                stream.on('error', function(error) {
                    throw error;
                });
            });
        }
    socket.on('stop-stream', function(data) {
            twit.currentStream.destroy()
            console.log('current stream destroyed')
        });
    });

    // Emits signal to the client telling them that the
    // they are connected and can start receiving Tweets
    socket.emit("connected");
});