var http = require("http");
var url = require("url");
var dgram = require('dgram');

var client = dgram.createSocket("udp4");
var portsinuse = 0;

function onRequest(request, response) {	
	if(!request.connection.remoteAddress){
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("Du kommst hier nicht rein!");
		response.end();
	}
	
	var pathname = url.parse(request.url).pathname;
	var ending = pathname.substring(pathname.length - 4, pathname.length);
	
	if(ending == "jcmp"){
		response.writeHead(200, {"Content-Type": "text/html"});
		
		var data = {};
		data.address = request.connection.remoteAddress;
		data.url = request.url;
		data.cookies = request.headers.cookie;
		data.port = 1735 + portsinuse + 1;
		
		var message = new Buffer(JSON.stringify(data));
		
		
		var server = dgram.createSocket("udp4");
		server.on("message", function (msg, rinfo) {
			console.log("Response from jcmp: " + data.port);
			response.write(msg);
			response.end();
			server.close();
			portsinuse = portsinuse - 1;
		});
		server.bind(1735 + portsinuse + 1);
		
		client.send(message, 0, message.length, 1734, "localhost", function(err, bytes) {
			portsinuse = portsinuse + 1;
		});
		console.log("Request to jcmp: " + 1734);
		
	}else{
		response.writeHead(200, {'Content-Type': 'text/html' });
		response.write('<meta HTTP-EQUIV="REFRESH" content="0; url=/index.jcmp">');
		response.end();
	}
}
		

http.createServer(onRequest).listen(80);

console.log("Server Started.");