const express = require("express");
const router = express.Router({ mergeParams: true })
const User = require("../models/user.js");
const wrapAsync = require("../wrapAsync");
const passport = require("passport")
const userController = require("../controller/user.js")
const { saveRedirectUrl } = require("../middleware.js")

//Get Sign Up Route
router.get("/signup", userController.getSignUp)

//Post Sign Up Route
router.post("/signup", wrapAsync(userController.postSignup))

//Login Route
router.get("/login", userController.login)

//Post Login Route
router.post("/login", saveRedirectUrl, passport.authenticate(`local`, { failureRedirect: `/login`, failureFlash: true }), userController.postLogin)

//Logout Route
router.get("/logout",userController.logOut)

//Export
module.exports = router;