var mongoose=require("mongoose");

var UserSchema= new mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    message:String,
    image: String
});


module.exports= mongoose.model("User",UserSchema);