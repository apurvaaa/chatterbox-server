
var dataBase = [
  {
    username: 'me',
    text: 'Hello world!'
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
    var post = JSON.parse(body);
    post.createdAt = new Date();
    // console.log(' ------- post : ' + JSON.stringify(post));
    dataBase.unshift(post);
    // console.log(' ------- DB : ' + JSON.stringify(dataBase));
  });
};

var methods = {
  'POST': function(request, callback) {
    collectData(request, callback);
  },
  'GET': function(response, dataBase, statusCode) {
    sendResponse(response, {results: dataBase}, statusCode);
  },
  'OPTIONS': function(response, dataBase, statusCode) {
    sendResponse(response, {results: dataBase}, statusCode);
  }
};

var requestHandler = function(request, response) {
 
  console.log('Serving request type ' + request.method + ' for url ' + request.url );
  if (request.url.indexOf('/classes/messages') !== 0) {
    response.statusCode = 404; 
    response.statusMessage = 'Not found';       // HTTP status 404: NotFound
    response.end();
  } else {
   
    var statusCode = 200;
    if (request.method === 'POST') {
      collectData(request);
      statusCode = 201;
      // data = {"username":"Jono","message":"Do my bidding!"}
    }
   
    

    if (request.method === 'OPTIONS') {
      console.log('options in ');
      console.log('request.header', request.headers);
      response.writeHead(statusCode, headers);
      response.end();
    }

    response.writeHead(statusCode, headers);

  
    response.end(JSON.stringify({results: dataBase}));
  }
};
module.exports.requestHandler = requestHandler;

