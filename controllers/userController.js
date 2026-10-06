const User = require("../model/User");
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// register user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);

    const schema = joi.object({
      name: joi.string().min(2).max(50).required(),
      email: joi.string().email().required(),
      password: joi.string().min(8).required(),
    });

    const { error } = schema.validate({ name, email, password });

    if (error) {
      res
        .status(500)
        .json({ success: false, message: "please send correct field", error });
    }

    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ suceess: false, message: "user already exist" });
    }

    //  password hash
    const hashPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT),
    );

    user = new User({
      name,
      email,
      password: hashPassword,
    });

    await user.save();

    res
      .status(201)
      .json({ success: true, message: "user registered successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "something error",
      error: err.message,
    });
  }
};

// login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(5).required(),
    });

    const { error } = schema.validate({ email, password });
    if (error) {
      res.status(500).json({ success: false, message: "invalid input", error });
    }

    const user = await User.findOne({ email });
    if (!user) {
     return  res.status(400).json({ success: false, message: "user not registereed" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "invalid password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    console.log(token)
    // HTTP mein data encrypted nahi hota. Network par koi attacker traffic ko intercept karke sensitive information dekh sakta hai.
    //   httpOnly → JavaScript se cookie hide
    // secure   → HTTPS par cookie
    // sameSite → cross-site requests control
    // maxAge   → cookie kitne time rahegi

    res.cookie("token", token, {
      httpOnly: true,
      // in browser, java script cant not read token directly - for secrity purpose, prevent XSS attack
      // <script>
      //     malicious code
      // </script>
      secure: process.env.NODE_ENV === "production",
      // HTTP mein data encrypted nahi hota. Network par koi attacker traffic ko intercept karke sensitive information dekh sakta hai.
      //  Secure = true → HTTPS only
      // Secure = false → HTTP + HTTPS
      sameSite: "lax",
      //   cross-site requests control
      maxAge: 24 * 60 * 60 * 1000,
    });
    // url
    // https://api.myapp.com:5000/users?id=10
    // https://api.myapp.com:5000 - origin - protocol + domain + port
    // https:// → protocol
    // api.myapp.com → domain/hostname
    // 5000 → port
    // /users → path
    // ?id=10 → query parameter

    res.status(200).json({ success: true, message: "logged in successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "server error", error: err.message });
  }
};

// update user
exports.updateUser = async (req, res)=>{
  try{
    const  id  = req.params.id
    console.log("update user id", id)
    const user = await User.findById(id)
    console.log("user", user)

    if(!user){
      return res.status(404).json({success: false, message: "user not found"})
    }

    const updateUser = await User.findByIdAndUpdate(id, req.body, { new : true})

    res.status(200).json({success: true, message: "user update successfully", user: updateUser})

  }catch(err){
    res.status(500).json({success: "false", message: "server error", error: err.message})
  }
}

// delete user
exports.deleteUser = async (req, res)=>{
  try{
 
     const id = req.params.id
     const user = await User.findById(id)
     if(!user){
      return res.status(404).json({ success: false, message: "user not found"})
     }

     const deleteUser = await User.findByIdAndDelete(id)

     res.status(200).json({success:true, message: "user delted successfully", deleteUser})

  }catch(err){
    res.status(500).json({ success: false, message: "sever error!", error: err.message})
  }
}

// forgot password
exports.forgotPassword  = async (req, res)=>{
  try{

    const { email } = req.body
    if(!email){
      return res.status(404).json({ success: false, message: "email is required"})
    }

    const user = await User.findOne({ email })
   if(!user){
    return res.status(404).json({ success: false, message: "user not found"})
   }

   const generateToken  =  jwt.sign(
    {userId : user._id},
    process.env.JWT_SECRET,
    { expiresIn: "15m"}
   )

   const resetLink =  `http://localhost:3000/api/user/resetPassword/${generateToken}`

   res.status(200).json({success: true, message: "token reset successfullty", resetLink})

  }catch(err){
    res.status(500).json({ success: false, message: "server error!", error: err.message })
  }
}


// reset password

exports.resetPassword = async (req, res)=>{
   try{

    const { token } = req.params
    const { password } = req.body

    if(!password){
      return res.status(400).json({ success: false, message: "password is required"})
    }

    const verifyToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    )
  
    // findOne() - filed ke basis pr first matching document nd need object
    // findById - _id ke basis par documen
    const user = await User.findById(verifyToken.userId)

  if(!user){
    return res.status(404).json({ success: false, message: "user not found"})
  }

  const hashPassword = await bcrypt.hash( password, parseInt(process.env.SALT))

  user.password = hashPassword
  await user.save()

  res.status(201).json({ success: true, message: "passwrod  created successfully"})

  }catch(err){
    res.status(500).json({ success: false, message: "server error!", error: err.message })
  }
}

// get all user

exports.getAllUser = async (req, res)=>{
   try{
   const currentpage = parseInt(req.query.page) || 1
   const limit = 5
   const skip = (currentpage - 1) * limit
    const totalUsers = await User.countDocuments()
    const totalPage = Math.ceil(totalUsers/limit)
    if(currentpage > totalPage){
      res.status(404).json({ success: false, message: "page not found"})
    }
    const users = await User.find().skip(skip).limit(limit)

    res.status(200).json({ success: true, message : "total user found", totalUser : totalUsers, totalPage : totalPage, users})
    
  }catch(err){
    res.status(500).json({ success: false, message: "server error!", error: err.message })
  }
}

