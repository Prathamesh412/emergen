var express = require("express");
var app = express ();
app.set("view engine", "ejs");
var mongoose= require("mongoose");
var router = express.Router();

var User=require("./models/User");


console.log("The database url is" + process.env.DATABASE_URL)
mongoose.connect("mongodb://localhost/emergen");    //connect to local database
//mongoose.connect("mongodb://admin:admin123@ds151892.mlab.com:51892/yelpcamp_db") //mongolab cloud connect
var bodyParser = require('body-parser');

//Middleware
app.use(express.static(__dirname + '/public'));
//app.use(methodOverride("_method"));
//app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//****************ROUTES********************

app.get("/about",function(req,res){
    res.render("about");
});
app.get("/contact-us",function(req,res){
    res.render("contact-us");
});
app.get("/copper-foils",function(req,res){
    res.render("copper-foils");
});
app.get("/copper-tube-pipes",function(req,res){
    res.render("copper-tube-pipes");
});
app.get("/copper-nugget",function(req,res){
    res.render("copper-nugget");
});
app.get("/copper-wires-rods",function(req,res){
    res.render("copper-wires-rods");
});
app.get("/quality",function(req,res){
    res.render("quality");
});
app.get("/",function(req,res){
    res.render("index");
});
app.get('*', function(req, res) {
    res.render("index");
  });


app.listen(process.env.PORT || 3000, () => console.log('App listening on port 3000!'));