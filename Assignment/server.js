var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var dbUrl = "mongodb://localhost:27017/";


(function ()
{
    var fs, http, qs, server, url;

	http = require('http');
	url = require('url');
	qs = require('querystring');
	fs = require('fs');
	
	var loginStatus = false, loginUser = "";
	
	server = http.createServer(function(req, res) 
	{
		var action, form, formData, msg, publicPath, urlData, stringMsg;
		urlData = url.parse(req.url, true);
		action = urlData.pathname;
		publicPath = __dirname + "\\public\\";
		console.log(req.url);
		
		if (action === "/register") 
		{
			console.log("Register");
			if (req.method === "POST") 
			{
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) 
				{
					formData += data;
                    console.log("form data="+ formData);
					return req.on('end', function() 
					{
						var user;
						user = qs.parse(formData);
						user.id = "0";
						//msg = JSON.stringify(user);
						//stringMsg = JSON.parse(msg);
						
						var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];
						var tempSplitPassword = splitMsg[1];

						var splitName = tempSplitName.split("=");
						var splitPassword = tempSplitPassword.split("=");
						
						var username =splitName[1];
						var password =splitPassword[1];

						console.log("login="+username);
						console.log("password="+password);
						//console.log("split=" + msg[1]);
						
						//res.writeHead(200, 
					    //	{
					    //		"Content-Type": "application/json",
					    //		"Content-Length": msg.length
					    //	});
						MongoClient.connect(dbUrl, function(err, db) 
						{
							var finalcount;
							if (err) throw err;
							var dbo = db.db("mydb");
							var myobj = stringMsg;
							dbo.collection("customers").count({"Name" : username,"Password" : password}, function(err, count)
							{
								console.log(err, count);
								finalcount = count;
								if(finalcount > 0)
								{
									if(err) throw err;
									console.log("user exist");
									db.close();
									return res.end("fail");
								}
								else
								{
									dbo.collection("customers").insertOne({"Name" : username,"Password" : password}, function(err, res) 
									{
										if (err) throw err;
										console.log("1 document inserted");
										db.close();
										//return res.end(msg);
									});
									return res.end("Record inserted");
								}
							});
						});
					});
				});
				
			} 
			else 
			{
				//form = publicPath + "ajaxSignupForm.html";
				form = "signin.html";
				return fs.readFile(form, function(err, contents) 
				{
					if (err !== true) 
					{
						res.writeHead(200, 
						{
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		} 
		else if( action ==="/newpage")
		{
			res.writeHead(200, 
			{
				"Content-Type": "text/html"
			});
			return res.end("<h1>welcome to new page</h1><p><a href=\"/register\">Register</a></p>");
		}
    else if (action === "/signin")
		{
			console.log("Sign in");
			if (req.method === "POST") 
			{
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) 
				{
					formData += data;
          
					console.log("form data="+ formData);
					return req.on('end', function() 
					{
						var user;
						user = qs.parse(formData);
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						
						var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];
						var tempSplitPassword = splitMsg[1];
						
						var splitName = tempSplitName.split("=");
						var splitPassword = tempSplitPassword.split("=");
						
						var username =splitName[1];
						var password =splitPassword[1];

						console.log("login="+username);
						console.log("password="+password);
	
					    //	res.writeHead(200, 
					    //	{
				        //			"Content-Type": "application/json",
					    //		"Content-Length": msg.length
						//});
						MongoClient.connect(dbUrl, function(err, db) 
						{
							var finalcount;
							if (err) throw err;
							var dbo = db.db("mydb");
							var myobj = stringMsg;
							dbo.collection("customers").count({"Name" : username, "Password" : password}, function(err, count)
							{
								console.log(err, count);
								finalcount = count;
								if(err) throw err;
								if(finalcount > 0)
								{
									loginStatus = true;
									loginUser = splitName[1];
									console.log("user exist, user is: " + loginUser);
									db.close();
									return res.end("Sign in successfully");
								}
								else
								{
									db.close();
									console.log("user or pw not match");
									return res.end("Sign in fail");
								}
							});
						});
					});
				});
			}
			else 
			{
				//form = publicPath + "ajaxSignupForm.html";
				form = "signin.html";
				return fs.readFile(form, function(err, contents) 
				{
					if (err !== true) 
					{
						res.writeHead(200, 
						{
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		}
		else if (action === "/Search")
		{
			console.log("search");
			if (req.method === "POST") 
			{
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) 
				{
					formData += data;
					console.log("form data="+ formData);
					return req.on('end', function() 
					{
						var user;
						user = qs.parse(formData);
						msg = JSON.stringify(user); 
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("=");
						console.log("msg: " + msg);
                        console.log("stringMsg: " + stringMsg);
						console.log("form data: "+ formData);
                        console.log("split: " + splitMsg[1]);
						/*res.writeHead(200, 
						{
							"Content-Type": "text/html",
							"Content-Length": msg.length
						});*/
						MongoClient.connect(dbUrl, function(err, db) 
						{
							var finalcount;
							if (err) throw err;
							var dbo = db.db("mydb");
							var myobj = stringMsg;
							dbo.collection("textlist").find({"keyword" : splitMsg[1]}, {"_id" : 0, "command" : 1, "texttitle" : 1}).toArray(function(err, result) 
							{
    						    if (err) throw err;
    						    //console.log("result: " + result);
                                db.close();
							    var resultReturn = JSON.stringify(result);
							    console.log("return: " + resultReturn);
							    return res.end(resultReturn);
						    });
						});
					});
				});
			}
			else 
			{
				form = "search.html";
				return fs.readFile(form, function(err, contents) 
				{
					if (err !== true) 
					{
						res.writeHead(200, 
						{
							"Content-Type": "text/html"
						});
						return res.end(contents);
					} 
					else 
					{
						res.writeHead(500);
						return res.end;
					}
				});
			}
		}
		else if (action === "/readfavourite")
		{
            if (req.method === "POST") 
			{
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) 
				{
					formData += data;
					console.log("form data="+ formData);
					return req.on('end', function() 
					{
						var user;
						user = qs.parse(formData);
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						
						var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];

						var splitName = tempSplitName.split("=");

						var username =splitName[1];

						console.log("login="+username);

					    //	res.writeHead(200, 
					    //	{
				        //			"Content-Type": "application/json",
					    //		"Content-Length": msg.length
						//});
						MongoClient.connect(dbUrl, function(err, db) 
						{
							var finalcount;
							if (err) throw err;
							var dbo = db.db("mydb");
							var myobj = stringMsg;
							dbo.collection("favourlist").find({"user" : username}).toArray(function(err, result) 
							{
								if (err) throw err;
								console.log(result);
								db.close();
								var resultReturn = JSON.stringify(result);
								console.log(resultReturn);
							    return res.end(resultReturn);
							});
						});
					});
				});
			}	
		}
		else if (action === "/addfavourite")
		{
            console.log("add favourite");
            if (req.method === "POST") 
            {
                console.log("action = post");
                formData = '';
                msg = '';
                return req.on('data', function(data) 
                {
                    formData += data;
                    console.log("form data="+ formData);
                    return req.on('end', function() 
                    {
                        var user;
                        user = qs.parse(formData);
                        var splitMsg = formData.split("&");
						var tempSplitName = splitMsg[0];
						var tempSplitPassword = splitMsg[1];
            var vdo = splitMsg[2];
                      
						var splitName = tempSplitName.split("=");
						var splitPassword = tempSplitPassword.split("=");
            var splitvdo = vdo.split("=");
						
						var username =splitName[1];
						var favorite =splitPassword[1];
            var vdourl=splitvdo[1];
						//	res.writeHead(200, 
					    //		{
						//		"Content-Type": "application/json",
					    //			"Content-Length": msg.length
					    //		});
						MongoClient.connect(dbUrl, function(err, db) 
						{
                            var finalcount;
                            if (err) throw err;
                            var dbo = db.db("mydb");
                            var myobj = {"user" : username, "favourite" : favorite,"vdolink":vdourl};
                            dbo.collection("favourlist").count(myobj, function(err, count)
                            {
                                console.log(err, count);
                                finalcount = count;
                                if(finalcount > 0)
                                {
                                    if(err) throw err;
                                    console.log("fav exist");
                                    db.close();
                                    return res.end("fail");
								}
								else
								{
                                    dbo.collection("favourlist").insertOne(myobj, function(err, res) 
									{
                                        if (err) throw err;
										console.log("fav inserted");
										db.close();
									});
									return res.end("Favorite Added");
								}
							});
                            dbo.collection("favourlist").find({}).toArray(function (err, result)
                            {
							    if (err) throw err;
								console.log(result);
								db.close();
							});
            });
					});
				});
			}	
        }
        else if (action === "/removefavourite")
		    {
            console.log("remove favourite");
			      if (req.method === "POST") 
            {
                console.log("action = post");
                formData = '';
                msg = '';
                return req.on('data', function(data) 
				        {
				            formData += data;
					          console.log("form data="+ formData);
					          return req.on('end', function() 
					          {
                        var user;
                        user = qs.parse(formData);

						            var splitMsg = formData.split("&");
                        var tempSplitName = splitMsg[0];

                        var splitName = tempSplitName.split("=");
                        var favid=splitName[1];
                        console.log("login="+favid);
                        //res.writeHead(200, 
						//{
						//		"Content-Type": "application/json",
						//		"Content-Length": msg.length
						//	});
						MongoClient.connect(dbUrl, function(err, db) 
						{
							var finalcount;
							if (err) throw err;
							var dbo = db.db("mydb");
							var myobj = {_id : new ObjectID(favid)};
							console.log(myobj);
							dbo.collection("favourlist").count(myobj, function(err, count)
							{
								console.log(err, count);
								finalcount = count;
								if(finalcount > 0)
								{
									dbo.collection("favourlist").deleteOne(myobj, function(err, res) 
									{
										if (err) throw err;
										console.log("fav removed");
										db.close();
									});
									return res.end(msg);
								}
								else
								{
									if(err) throw err;
									console.log("fav not exist");
									db.close();
									return res.end("fail");
								}
							});
              dbo.collection("favourlist").find({}).toArray(function (err, result)
              {
                  if (err) throw err;
                  console.log(result);
                  db.close();
              });
            });
					});
				});
			}
        }
		else 
		{
        //handle redirect
      if(req.url === "/index") 
			{
					sendFileContent(res, "index.html", "text/html");
			}
			else if (req.url === "/signout")
			{
				loginStatus = false;
				loginUser = "";
				sendFileContent(res, "signout.html", "text/html");
			}
      else if (req.url === "/contact")
            {
				sendFileContent(res, "contact.html", "text/html");
			}
      else if (req.url === "/favourite")
			{
				sendFileContent(res, "favourite.html", "text/html");
			}
      else if (req.url === "/check")
			{
				sendFileContent(res, "check.html", "text/html");
			}
      else if (req.url === "/case")
			{
				sendFileContent(res, "case.html", "text/html");
			}
      else if (req.url === "/news")
			{
				sendFileContent(res, "news.html", "text/html");
			}
      else if (req.url === "/test")
			{
				sendFileContent(res, "index2.html", "text/html");
			}
			else if(req.url === "/")
      {
        sendFileContent(res, "index.html", "text/html");
			}
			else if(/^\/[a-zA-Z0-9\/]*.js$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "text/javascript");
			}
			else if(/^\/[a-zA-Z0-9\/]*.css$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "text/css");
			}
			else if(/^\/[a-zA-Z0-9\/]*.jpg$/.test(req.url.toString()))
			{
				sendFileContent(res, req.url.toString().substring(1), "image/jpg");
			}
			else
			{
				console.log("Requested URL is: " + req.url);
				res.end();
      }
    }
	});

	server.listen(8899);
	console.log("Server is running. Time is" + new Date());

	function sendFileContent(response, fileName, contentType)
	{
		fs.readFile(fileName, function(err, data)
		{
			if(err)
			{
				response.writeHead(404);
				response.write("Not Found!");
			}
			else
			{
				response.writeHead(200, {'Content-Type': contentType});
				response.write(data);
			}
			response.end();
		});
    }
}).call(this);
