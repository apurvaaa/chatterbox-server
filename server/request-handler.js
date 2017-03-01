
var qs = require('querystring');
var objectIdCounter = 0;
var dataBase = [
  {
    username: 'me',
    text: 'Hello world!',
    objectId: -1
  }
];
var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/JSON'
};

var sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

var collectData = function(request, callback) {
  var body = '';
  
  request.on('data', function (data) {
    // console.log(' ---- data : ' + data);
    body += data;
    if (callback) {
      callback(data);
    }
    // console.log(' ---- body : ' + body);
  });

  request.on('end', function () {
    console.log('----body : ', body);
    var post = qs.parse(body);
    console.log(' ----- post : ', post);
    post.createdAt = new Date();
    post.objectId = objectIdCounter++;
    // console.log(' ------- post : ' + JSON.stringify(post));
    dataBase.push(post);
    // console.log(' ------- DB : ' + JSON.stringify(dataBase));
  });
};

var methods = {
  'POST': function(request, response) {
    collectData(request, function(data) {
      // TODO: get data
    });
    sendResponse(response, 'hello there', 201);
  },
  'GET': function(request, response) {
    sendResponse(response, {results: dataBase});
  }, 
  'OPTIONS': function(request, response) { 
    sendResponse(response, {results: dataBase});
  }
};

var requestHandler = function(request, response) {
 
  console.log('Serving request type ' + request.method + ' for url ' + request.url );
  if (methods[request.method] &&  
    (request.url.indexOf('/classes/messages') === 0 || 
    request.url.indexOf('/classes/room') === 0)) {
    methods[request.method](request, response);
  } else {
    response.statusCode = 404; 
    response.statusMessage = 'Not found';       // HTTP status 404: NotFound
    response.end();
  }
};
module.exports.requestHandler = requestHandler;

