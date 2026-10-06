 const express = require("express")
 const cookieParser = require("cookie-parser");

 require("dotenv").config()

 const app = express()

 const connectDB = require("./config/db")
 const userRouter = require("./routes/userRoute")

 app.use(express.json())
 app.use(cookieParser())

app.use("/api", userRouter)

connectDB()

 app.listen(process.env.PORT, ()=>{
  console.log("server is running on PORT 3000")
 })

