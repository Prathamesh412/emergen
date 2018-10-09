var mongoose=require("mongoose");

var UserSchema= new mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    message:String,
    attachment:String
});


module.exports= mongoose.model("User",UserSchema);