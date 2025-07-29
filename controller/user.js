const User=require("../models/user.js")
//Signup 
module.exports.getSignUp = (req, res) => {
    res.render("users/signup.ejs")
}

//Post Sigup
module.exports.postSignup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username })
        const registeredUser = await User.register(newUser, password)
        console.log(registeredUser)
        let redirectUrl = req.session.redirectUrl || "/listings";
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", "Welcome to Airbnb")
            res.redirect(redirectUrl)
        })
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect("/signup")
    }
}

//login Route
module.exports.login=(req,res)=>{
    res.render("users/login.ejs");
}

//Post login route
module.exports.postLogin=(req,res)=>{
    req.flash("success","Welcome to airbnb ");
    let redirectUrl=res.locals.redirectUrl||"/listings"
    res.redirect(redirectUrl)
}

//Logout Route
module.exports.logOut= (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next();
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings")
    })
}