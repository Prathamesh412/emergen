var mongoose=require("mongoose");

var UserSchema= new mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    message:String,
    image: { data: Buffer, contentType: String }
});


module.exports= mongoose.model("User",UserSchema);