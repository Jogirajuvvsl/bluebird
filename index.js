var express = require('express');
var bodyParser=require("body-parser");
var app = express();
var path = require('path');
var fetch = require('node-fetch');
var cfenv = require('cfenv');
var request = require('request');
var Cloudant = require('cloudant');


var cloudant_url="https://7b459843-f6fb-4685-af1d-e8d0f77c5e27-bluemix:d34d8950d98d3445db14ef1272486392aedb6b9edb36c8c65c41b09fc269f8d1@7b459843-f6fb-4685-af1d-e8d0f77c5e27-bluemix.cloudant.com";
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");

//middleware code snippets
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static(__dirname + '/public'));
var cloudant_url="https://7b459843-f6fb-4685-af1d-e8d0f77c5e27-bluemix:d34d8950d98d3445db14ef1272486392aedb6b9edb36c8c65c41b09fc269f8d1@7b459843-f6fb-4685-af1d-e8d0f77c5e27-bluemix.cloudant.com";
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//middleware which is called for all controller calls mentioned below
app.use(bodyParser.urlencoded({extended:true}));

if(process.env.VCAP_SERVICES)
{
	services = JSON.parse(process.env.VCAP_SERVICES);
	if(services.cloudantNoSQLDB) //Check if cloudantNoSQLDB service is bound to your project
	{
		cloudant_url = services.cloudantNoSQLDB[0].credentials.url;  //Get URL and other paramters
		console.log("Name = " + services.cloudantNoSQLDB[0].name);
		console.log("URL = " + services.cloudantNoSQLDB[0].credentials.url);
        console.log("username = " + services.cloudantNoSQLDB[0].credentials.username);
		console.log("password = " + services.cloudantNoSQLDB[0].credentials.password);
	}
}

//Connect using cloudant npm and URL obtained from previous step
var cloudant = Cloudant({url: cloudant_url});
//Edit this variable value to change name of database.
//var dbname = 'estestframework';
var dbname = 'estest8framework_database';
var db;

//Create database
cloudant.db.create(dbname, function(err, data) {
  	if(err) //If database already exists
	    console.log("Database exists. Error : ", err); //NOTE: A Database can be created through the GUI interface as well
  	else
	    console.log("Created database.");
    console.log("after Db creation");
  	//Use the database for further operations like create view, update doc., read doc., delete doc. etc, by assigning dbname to db.
  	db = cloudant.db.use(dbname);
    //Create a design document. It stores the structure of the database and contains the design and map of views too
    //A design doc. referred by _id = "_design/<any name your choose>"
    //A view is used to limit the amount of data returned
    //A design document is similar to inserting any other document, except _id starts with _design/.
    //Name of the view and database are the same. It can be changed if desired.
    //This view returns (i.e. emits) the id, revision number and new_city_name variable of all documents in the DB
	//Changed the view to store email id,mobile number and base64 image of the image added by jogi
  	db.insert(
	 {
		  	_id: "_design/estest8framework_database",
		    views: {
	  				  "estest8framework_database":
	  				   {
	      					"map": "function (doc) {\n  emit(doc._id, [doc._id,doc._rev,doc.name,doc.mail_id,doc.mailflag,doc.phonenumber,doc.phoneflag,doc.image]);\n}"
	    			   }
      	   		   }
     },
	 function(err, data) {
	    	if(err)
	    			console.log("View already exsits. Error: ", err); //NOTE: A View can be created through the GUI interface as well
	    	else
	    		console.log("estest7framework_database view has been created");
	 });

});


//changed from get to post to be able to recieve large data from front end Added by Jogi
app.post('/add_details',function(req, res){ //to add a city into the database
    console.log("inside post");
    //console.log("inside post")
	//console.log("req is wihtout "+(req.new_name));
	var req2=JSON.parse(JSON.stringify(req.body));
    //console.log("new name is "+req2.new_name);
    //console.log("");
	//req.query.new_name = req.new_name.toUpperCase(); //convert to uppercase and trim white space before inserting
	//req.query.new_name = req.query.new_name.trim();
  
	  req2.name=req2.name.toUpperCase();
	  req2.name=req2.name.trim();
	  var req1=
	  {name:req2.name,
		  mail_id:req2.mail_id,
		  mailflag:req2.mailflag,
		  phonenumber:req2.phonenumber,
		  phoneflag:req2.phoneflag,
	      "_attachments":{
			   "photo":{
				   "content_type":"image\/png",
				   "data":req2.image}}};
	  
	console.log(req1);
    console.log("after req1");
	//Search through the DB completely to check for duplicate name, before adding a new name
	var url = cloudant_url + "/estest8framework_database/_design/estest8framework_database/_view/estest8framework_database";
	var name_present = 0; //flag variable for checking if name is already present before inserting
	var name_string; //variable to store update for front end.
    console.log(url);
	//console.log(req1);
	//In this case, check if the ID is already present, else, insert a new document
    	request({
			 url: url,
			 json: true
			}, function (error, response, body) {
		if (!error && response.statusCode === 200)
		{
			//Check if current input is present in the table, else add. If present then return with error message
			var user_data = body.rows;
			console.log("length of table: " + user_data.length);
			var loop_len = user_data.length;
			//console.log(req1);
			for(var i=0; i< loop_len; i++)
			{
				var doc = user_data[i];
				console.log("in Db : " + doc.value[2]);
				if(req1.new_name === doc.value[2])
				{
					name_present = 1;
					break;
				}
			}
			if(name_present === 0) //if city is not already in the list
			{
				db.insert(req1, function(err, data){
					if (!err)
					{
						console.log("Added new name");
						name_string="{\"added\":\"Yes\"}";
						res.contentType('application/json'); //res.contentType and res.send is added inside every block as code returns immediately
						res.send(JSON.parse(name_string));
					}
					else
					{
						console.log("Error inserting into DB " + err);
						name_string="{\"added\":\"DB insert error\"}";
						res.contentType('application/json');
						res.send(JSON.parse(name_string));

					}
				});
		    }
			else
			{
				console.log("Name is already present");
				name_string="{\"added\":\"No\"}";
				res.contentType('application/json');
				res.send(JSON.parse(name_string));
			}
		}
		else
		{
			console.log("No data from URL. Response : " + response.statusCode);
			name_string="{\"added\":\"DB read error\"}";
			res.contentType('application/json');
			res.send(JSON.parse(name_string));
		}
	});
});

//changed from get to post to be able to recieve large data from front end Added by Jogi
app.get('/getAllDetails',function(req, res){ //to add a city into the database
    console.log("Enter the get All details");
	//Search through the DB to get the details of all records
	var url = cloudant_url + "/estest8framework_database/_design/estest8framework_database/_view/estest8framework_database";
    //In this case, check if the ID is already present, else, insert a new document
    	request({
			 url: url,
			 json: true
			}, function (error, response, body) {
		if (!error && response.statusCode === 200)
		{       console.log("made call to cloudant");
			    console.log(body);
				//res.send(JSON.parse(body));
				
				//Check if current input is present in the table, else add. If present then return with error message
			var user_data = body.rows;
			console.log("length of table: " + user_data.length);
			var loop_len = user_data.length;
			res.send(user_data);
			//console.log(req1);
			console.log("Sent the data");
		}
		else
		{
			console.log("No data from URL. Response : " + response.statusCode);
			name_string="{\"added\":\"DB read error\"}";
			res.contentType('application/json');
			res.send(JSON.parse(name_string));
		}
	});
});

app.get('/login.html', function(req, res){
   res.sendFile( __dirname + "/" + "login.html" );
});

app.get('/admin.html', function(req, res){
   res.sendFile( __dirname + "/" + "admin.html" );
});
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


app.get('/phonenumber.html', function(req, res){
 res.sendFile( __dirname + "/" + "phonenumber.html" );
});

app.get('/first.html', function(req, res){
 res.sendFile( __dirname + "/" + "first.html" );
});

app.get('/regis.html', function(req, res){
 res.sendFile( __dirname + "/" + "regis.html" );
});

app.get('/googlepop.html', function(req, res){
 res.sendFile( __dirname + "/" + "googlepop.html" );
});



app.get('/second.html', function(req, res){
 res.sendFile( __dirname + "/" + "second.html" );
});

app.post('/details.html', function(req, res){
 console.log("In detail Host");
 var d = new Date();
  var date=new Date(d.toISOString());
  var timeStamp = Math.floor(Date.now() / 1000);
});
 


var request = require("request");
request({
  uri: "http://localhost:5984/bluebird/113",
  method: "GET",
  timeout: 10000,
  followRedirect: true,
  maxRedirects: 10
}, function(error, response, body) {
  console.log(body);
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

