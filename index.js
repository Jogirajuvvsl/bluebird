var express = require('express');
var bodyParser=require("body-parser");
var app = express();
var path = require('path');
var fetch = require('node-fetch');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//middleware which is called for all controller calls mentioned below
app.use(bodyParser.urlencoded({extended:true}));
app.get('/login.html', function(req, res){
   res.sendFile( __dirname + "/" + "login.html" );
});
app.post('/login.html', function(req, res){
var creds=req.body;
//console.log(req.body);
if(req.body.u=="jogiraju")
 res.sendFile(__dirname + "/" + "homepage.html");
});
app.get('/details.html', function(req, res){
 res.sendFile( __dirname + "/" + "details.html" );
});
app.post('/details.html', function(req, res){
 console.log("In detail Host");
 var d = new Date();
  var date=new Date(d.toISOString());
  var timeStamp = Math.floor(Date.now() / 1000);
 
 
  console.log(timeStamp);
 console.log('http://127.0.0.1:5984/bluebird/'+timeStamp);


var request = require("request");
/*request({
  uri: "http://localhost:5984/bluebird/113",
  method: "GET",
  timeout: 10000,
  followRedirect: true,
  maxRedirects: 10
}, function(error, response, body) {
  console.log(body);
});*/

var data = {"vname": "bar", "woo": "car"};
console.log("reached");

request({ url:'http://127.0.0.1:5984/bluebird/'+timeStamp,method: 'PUT', json: {"vname":req.body.vname, "email":req.body.email,"image":req.body.imageBase64}}, function(error, request, body){
   console.log(body);
});

});




/*request({
    uri:'http://127.0.0.1:5984/bluebird/'+timeStamp,	
   method: 'PUT',
   multipart: [{
       'content-type':'application/json',
       body:data 
   }]
}, function(error, request, body){
   console.log(body);
});
res.end();
console.log("Not reached");

});*/



app.listen(3000);

