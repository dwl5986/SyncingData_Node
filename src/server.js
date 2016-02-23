var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');
var port = process.env.PORT || process.env.NODE_PORT || 3000;

//read the client html file into memory
//__dirname in node is the current directory
//in this case the same folder as the server js file
var index = fs.readFileSync(__dirname + '/../client/client.html');

function onRequest(request, response) {

 response.writeHead(200, {"Content-Type": "text/html"});
 response.write(index);
 response.end();
}
var app = http.createServer(onRequest).listen(port);
console.log("Listening on 127.0.0.1:" + port);

//pass in the http server into socketio and grab the websocket server as io
var io = socketio(app);

// When there is a server connection
io.sockets.on("connection", function(socket) {

  socket.join('Main Room');

  socket.on('newCanvas', function(data) {
    io.sockets.in('Main Room').emit('updateImage', data);
  });

  //When someone disconnects, remove their websocket from the socket room
  socket.on('disconnect', function(data) {
    socket.leave('Main Room');
  });
});

console.log('websocket server started');
