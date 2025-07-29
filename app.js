require("dotenv").config();
const express = require("express")
const app = express();
const mongoose = require("mongoose")
const session = require("express-session")
const MongoStore=require(`connect-mongo`)
const dbUrl=process.env.ATLASDB_URL
const methodOverride = require("method-override")
const path = require("path")
const engine = require('ejs-mate')
const expressError = require("./expressError.js")
const listingRouter = require("./router/router.js")
const reviewRouter = require("./router/review.js")
const userRouter = require("./router/user.js")
const flash = require("connect-flash")
const passport = require("passport")
const localStrategy = require("passport-local");
const User = require("./models/user.js")
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json())
app.set("view engine", "ejs")
app.engine("ejs", engine)
app.set("views", path.join(__dirname, "views"));
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
})
const sessionOption = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expries: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}
main().then(() => {
    console.log("connection succesful");
}).catch((err) => {
    console.log(err)
})
async function main() {
    await mongoose.connect(dbUrl)
}
app.use(flash())
app.use(session(sessionOption))
app.use(passport.initialize());
app.use(passport.session())
app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    next();
})
app.use("/listings", listingRouter)
app.use("/listings/:id", reviewRouter)
app.use("/", userRouter)
app.get("/demo", async (req, res) => {
    let fakeUser = new User({
        email: "kurkuteomkar@gmail.com",
        username: "Kurkute Omkar",
    })
    let registeredUser = await User.register(fakeUser, "helloword")
    res.send(registeredUser)
})
app.use((req, res, next) => {
    next(new expressError(404, "Hey entered wrong route so please correct it"))
})
app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    res.render("error.ejs", { err })
    // res.status(statusCode).send(message);

})
app.listen(8080, () => {
    console.log("Listening to the Port 8080");
})