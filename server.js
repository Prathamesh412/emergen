var express = require("express");
var multer = require('multer');
var path = require('path');
var app = express ();
app.set("view engine", "ejs");
var mongoose= require("mongoose");
var router = express.Router();
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var User=require("./models/User"); //model imported.


//login with passport starts
// const passport = require('passport')
// const bcrypt = require('bcrypt')
// const LocalStrategy = require('passport-local').Strategy

// const loginuser = {
//   username: 'test',
//   passwordHash: 'test',
//   id: 1
// }
// function findUser (username, callback) {
//     if (username === loginuser.username) {
//       return callback(null, loginuser)
//     }
//     return callback(null)
//   }
  
//   passport.serializeUser(function (loginuser, cb) {
//     cb(null, loginuser.username)
//   })
  
//   passport.deserializeUser(function (username, cb) {
//     findUser(username, cb)
//   })
  
//   function initPassport () {
//     passport.use(new LocalStrategy(
//       (username, password, done) => {
//         findUser(username, (err, loginuser) => {
//           if (err) {
//             return done(err)
//           }
  
//           // User not found
//           if (!loginuser) {
//             console.log('User not found')
//             return done(null, false)
//           }
  
//           // Always use hashed passwords and fixed time comparison
//           bcrypt.compare(password, loginuser.passwordHash, (err, isValid) => {
//             if (err) {
//               return done(err)
//             }
//             if (!isValid) {
//               return done(null, false)
//             }
//             return done(null, loginuser)
//           })
//         })
//       }
//     ))
// }
  
// passport.authenticationMiddleware = authenticationMiddleware

// function authenticationMiddleware () { // passport middleware
//     return function (req, res, next) {
//       if (req.isAuthenticated()) {
//         return next()
//       }
//       res.redirect('/')
//     }
//   }
// login with passport ends

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
mongoose.connect("mongodb://emergenadmin:emergen123@ds255260.mlab.com:55260/emergen",{ useNewUrlParser: true }) //mongolab cloud connect
//mongoose.connect("mongodb://admin:admin123@ds151892.mlab.com:51892/yelpcamp_db") //mongolab cloud connect
var bodyParser = require('body-parser');

//Middleware
app.use(express.static(__dirname + '/public'));
//app.use(methodOverride("_method"));
//app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(passport.initialize());
//app.use(passport.session());
// app.use(robots({UserAgent: '*', Disallow: '/'})) //robot.txt to stop crawling

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
app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /aryan1993/ \nDisallow: /uploads ");
});

app.get("/aryan1993/images/:page",function(req,res){

    var perPage = 10;
    var page = req.params.page || 1;
   // console.log(page)
    User.find({}).skip((perPage * page) - perPage)
    .limit(perPage)
   // .sort({ 'user._id.getTimestamp()' : -1})  //sort needs to be done
    .exec(function(err,alluser){
        User.countDocuments().exec(function(err,count){
        if(err){
            console.log(err)
        }
        else{
            res.render("imagelist",{users:alluser,
                current: page,
                pages: Math.ceil(count / perPage)})
        }
      //  console.log(count)
        })
    })
});

app.get("/aryan1993/:id",function(req,res){ 
    User.findById(req.params.id,function(err,foundOneUser){
        if(err){
            console.log(err);
        }
        else{
            res.render("singleupload",{user:foundOneUser});
         //  console.log(user);
        }
    })
});

app.get("/login",function(req,res,){ 
       res.render("login");
});

app.post('/login',function(req,res,next){
    console.log("loginuser")
    passport.authenticate("local", function(err, loginuser, info){
        console.log(loginuser)
        if(err){
            res.redirect("/")
        }
        else{
            res.redirect("/aryan1993/images/:page")
        }
   })
})


var imageName;
var uploadFile = upload.single('image');
app.post('/send', uploadFile, (req, res) => {

    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var message = req.body.message;
   // console.log("The length is" + req.file.filename.length)
   // console.log(req.file)
    if (req.file){
    var image = req.file.filename
    }
    else{
        var image = "null"
    }
    console.log(image);
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
    if (req.file){
    var output = 
    `
      <p>You have a new Contact Request from Energen Website</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
        <li>image: ${req.file.filename}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `;
    }
    else{
        var output = 
    `
      <p>You have a new Contact Request from Energen Website</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `;
    }   //
  
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: 'cechque@gmail.com',
          pass: 'qwerty@123'
        }, tls:{
            rejectUnauthorized:false  // remove when uploading on server
          }
      }));
      
      var mailOptions = {
        from: 'cechque@gmail.com',
        to: 'prathprabhu@gmail.com',
        subject: 'New Enquiry for Energen',
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


app.listen(process.env.PORT || 80, () => console.log('Energen App started'));