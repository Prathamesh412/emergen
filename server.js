var express = require("express");
var multer = require('multer');
var path = require('path');
var app = express ();
app.set("view engine", "ejs");
var mongoose= require("mongoose");
var router = express.Router();
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var User=require("./models/User");

// Multer image start
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './public/uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname); //replace is used to save in computer readable format
    }
  });

const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    }
});
// Multer stop

//console.log("The database url is" + process.env.DATABASE_URL);
//mongoose.connect("mongodb://localhost/emergen");    //connect to local database
mongoose.connect("mongodb://emergenadmin:emergen123@ds255260.mlab.com:55260/emergen") //mongolab cloud connect
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

var imageName;
var uploadFile = upload.single('image');
app.post('/send', uploadFile, (req, res) => {

    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var message = req.body.message;
    var image = req.file.originalname;
    console.log(req.file.originalname);
    //console.log(name,image);
    var newUser= {name:name,email:email,phone:phone,message:message,image:image};

    User.create(newUser,function(err,newCreatedUser){
        if(err){
            console.log(err);
        }
        else{
            console.log(newCreatedUser);
        }
    })

    // Mailer implementation
    var output = `
      <p>You have a new Contact Request from Emergen Website</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
        <li>Phone: ${req.file.path}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `;
    // <h3>Attachment</h3>  Attachments if need to be added above in output
    // <p>${req.body.attachment}</p>
  
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: 'cechque@gmail.com',
          pass: 'asd@1234'
        }, tls:{
            rejectUnauthorized:false  // remove when uploading on server
          }
      }));
      
      var mailOptions = {
        from: 'cechque@gmail.com',
        to: 'prathprabhu@gmail.com',
        subject: 'New Enquiry for Emergen',
        text: 'That was easy!',
        html: output
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
        res.redirect('/contact-us');
      }); 
});

app.get('*', function(req, res) {
    res.render("index");
});


app.listen(process.env.PORT || 3000, () => console.log('App listening on port 3000!'));