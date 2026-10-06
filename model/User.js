const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name : {
    type : String,
    minlength: 2,
    maxlength : 50,
    trim : true, 
    required : true
  },
  email : {
    type : String,
    trim : true, 
    required : true,
    unique : [true, "email already exist"]
  },

  password : {
    type : String,
    minlength : 8, 
  },

  role : {
    type : String,
    enum : ["user", "admin"],
    default : "user"
  },

},  { timestamps : true})

const User = mongoose.model("User", userSchema)
 module.exports = User