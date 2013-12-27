
--[[ Example Requesthandler:
Events:Subscribe("HttpRequest", function(args)
	Events:Fire("HttpResponse", {port=args.port, html=args.address})
	return false
end)
]]

local server = UDPSocket.Create()
server:Bind(1734)

function Receive(args)
	
	response = Events:Subscribe("HttpResponse", function(args)
		Events:Unsubscribe(response)
		client = UDPSocket.Create()
		client:Send("127.0.0.1", args.port, args.html)
	end)
	
	request = json():decode(args.text)
	if Events:Fire("HttpRequest", request) then
		Events:Unsubscribe(response)
		client = UDPSocket.Create()
		client:Send("127.0.0.1", request.port, "<h1>Error 001</h1>No request handler found.")
	end

	server:Close()
	server = nil
	server = UDPSocket.Create()
	server:Bind(1734)
	server:Receive(Receive)
end

server:Receive(Receive)

