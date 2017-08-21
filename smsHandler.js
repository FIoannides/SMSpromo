var http = require('http');

http.createServer(function (req, res) {
	const { headers, method, url } = req;
	console.log("URL:" + url);
	
	// check URL endpoint
	if(url == '/api/sms-promotion') {
		
		let body = [];
		req.on('error', (err) => {
			console.error(err);
			if(err){
				res.writeHead(500, {'Content-Type': 'text/html'});
				return res.end("Failed reading request body");
			}
		}).on('data', (chunk) => {
			body.push(chunk);
		}).on('end', () => {
			
			// compose request body
			body = Buffer.concat(body).toString();
			
			res.on('error', (err) => {
				console.error(err);
			});
			
			// read and decode request body
			var phone = decodeURIComponent(body.substr(body.indexOf("phone=") + "phone=".length));
			console.log(phone);
			
			if(phone != ""){
				var d = new Date();
				var n = d.getHours();
				var responseString;
				
				// check hour of day
				if (n > 12) {
					responseString = 'Hello! Your promocode is PM456';
				} else {
					responseString = 'Good morning! Your promocode is AM123';
				}
				
				// Twilio Credentials 
				var accountSid = 'ACc5c7c7c7ddefcf309ecca53a0264b335'; 
				var authToken = '3412a892d8ed2c03d3a3a8ec22f1bc84'; 
				 
				//require the Twilio module and create a REST client 
				var client = require('twilio')(accountSid, authToken); 
				 
				client.messages.create({ 
					to: phone, 
					from: "+16194737790", 
					body: responseString, 
				}, function(err, message) { 
					if(err || !message.sid){
						res.writeHead(500, {'Content-Type': 'text/html'});
						return res.end("Failed to send SMS");
					} else {
						res.writeHead(200, {'Content-Type': 'text/html'});
						return res.end("SMS send successfully");
					}
				});
			} else {
				res.writeHead(500, {'Content-Type': 'text/html'});
				return res.end("Invalid phone number");
			}
		});
	} else {
		res.writeHead(404, {'Content-Type': 'text/html'});
		return res.end("404 Not Found");
	}
}).listen(8080);