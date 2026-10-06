const express = require("express")
const { registerUser, loginUser, updateUser, deleteUser, forgotPassword, resetPassword, getAllUser } = require("../controllers/userController")

const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()

// register
router.post("/register", registerUser)
// login 
router.post("/login", loginUser)

// // update user
router.put("/user/:id", authMiddleware, updateUser)

// // delete user
router.delete("/user/:id", authMiddleware,  deleteUser)

// // forgot password
router.post("/forgot-passwrod", forgotPassword)
// // reset passwrod
router.post("/reset-password/:token", resetPassword)

// // get user
router.get("/users", getAllUser)

module.exports = router
