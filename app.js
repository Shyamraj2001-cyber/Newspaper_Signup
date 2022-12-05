const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const Email = req.body.email;

  const data = {
    members: [
      {
        email_address: Email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  const JsonData = JSON.stringify(data);

  const url = 'https://us14.api.mailchimp.com/3.0/lists/3e77ba6fb3';

  const options = {
    method: "POST",
    auth: "shyamraj:0a7ed1cfaadd78a41275a243b635c24d-us14"
  }

  const request = https.request(url, options, function(response){

    if(response.statusCode===200){
      res.sendFile(__dirname + "/success.html");
    }
    else{
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(JsonData);
  request.end();
});


app.post("/failure.html" , function(req,res){
  res.redirect("/");
});

// API KEYS
// 0a7ed1cfaadd78a41275a243b635c24d-us14

// cllient id
// 3e77ba6fb3

app.listen(process.env.PORT || 3000,function(){
  console.log("Server started working on port: 3000");
});