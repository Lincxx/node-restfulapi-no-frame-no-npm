/*
    Primary file for the API
*/

//Dependenices
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');



//The server should repond to all requests with a string
const server = http.createServer(function (req, res) {

    // Get the URL and parse it
    var parsedUrl = url.parse(req.url, true);

    // Get the path from the URL 
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '')

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the HTTP Method
    var method = req.method.toLowerCase();

    // Get the headers as an object
    var headers = req.headers;

    // Get the payload, if any (Stream in a payload and handle it )
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    req.on('end', function () {
        buffer += decoder.end();

        // choose the handler this request should go to. If one not found use the notFound handler
        var chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        //construct the data obj to send to the handler.
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        // Route the request to the handler specified in the router
         chosenHandler(data, function(statusCode, payload){
            // Use the statuscode called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Use the payload called back by the handler, or default to an empty obj
            payload = typeof(payload) == 'object'? payload : {};

            // Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            //return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            
            console.log('Returning this response ', statusCode, payloadString);            
         });
        
    });


});

//Start the server, and have it listen on port 3000
server.listen(config.port, function () {
    console.log('The server is listening on port ' + config.port + " in " + config.envName + " mode");
});

//Define the handlers
var handlers = {};

//sample handlers
handlers.sample = function (data, callback) {
    // callback a http status code, and a payload obj
    callback(406, { 'name': 'sample handler' })
};

//Not found handler
handlers.notFound = function (data, callback) {
    callback(404)
};

//Define a request router
var router = {
    'sample': handlers.sample
};