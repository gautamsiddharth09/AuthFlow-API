const  token = require("jsonwebtoken")
const User = require("../model/User")
const jwt = require("jsonwebtoken")


const authMiddleware = async (req, res, next)=>{
  try{
    // const { token = req.cookies }
     
    const  token  = req.cookies.token
    console.log("token", token)
    if(!token){
      return res.status(401).json({ success : false, message : "not athorised"})
    }

    const verifyToken =  await jwt.verify(token, process.env.JWT_SECRET)
    console.log("verifytoken", verifyToken)

    const userInfo = await User.findById(verifyToken.userId).select("-password")
    console.log("userInfor", userInfo)

    if(!userInfo){
      return res.staus(404).json({success:false, message: "user not found"})
    }

    next()
  }catch(err){
    res.status(500).json({success : false, message : "invalid token", error : err.message})
  }
}

module.exports = authMiddleware