const Listing = require("../models/listing.js")
const Review = require("../models/review.js")
const mongoose = require("mongoose")
//Posting review
module.exports.postingNewReview = async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id;
    console.log(newReview)
    listing.reviews.push(newReview)
    await newReview.save();
    await listing.save();
    req.flash("success", "New review is added")
    console.log("Review is added succesfully")
    res.redirect(`/listings/${id}`)
}

//Deleting Review
module.exports.deletingReview = async (req, res) => {
    let { id, reviewsId } = req.params;
    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: new mongoose.Types.ObjectId(reviewsId) }
    })
    await Review.findByIdAndDelete(reviewsId)
    req.flash("success", "Review Deleted")
    res.redirect(`/listings/${id}`)
}