const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema,reviewSchema}=require("./schema.js")
const expressError = require("./expressError.js")
module.exports.isLogIn=(req,res,next)=>{
  console.log(req.path,"....",req.originalUrl)
  // console.log(req.user)
    if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create listing")
        return res.redirect("/login")
  }
  next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
next()
}
module.exports.isOwner=async (req,res,next)=>{
  let { id } = req.params;
  let listing=await Listing.findById(id)
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","Youb don't have permission to edit")
    return res.redirect(`/listings/${id}`)
    }
    next();
}
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
 
  if (error) {
  const msg = error.details.map(el => el.message).join(", ");
  throw new expressError(400, msg);
  } else {
  next();
 }
 };
 module.exports.validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);

  if(error){
      throw new expressError(400,error.details.map(el => el.message).join(", "))
  }
  else{
      next()
  }
}

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewsId } = req.params;
  let review = await Review.findById(reviewsId);

  if (!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the author of the review");
      return res.redirect(`/listings/${id}`);
  }
  next();
};
