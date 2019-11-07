var mongoose=require("mongoose");

var UserSchema= new mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    organisation: String,
    designation:String,
    message:String,
    image: String
});


module.exports= mongoose.model("User",UserSchema);