const express = require("express")
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../wrapAsync.js")
const { validateReview, isLogIn, isReviewAuthor } = require("../middleware.js")
const reviewController = require("../controller/review.js")

//Posting new Review
router.post("/reviews", isLogIn, validateReview, wrapAsync(reviewController.postingNewReview))

//Delete review route
router.delete("/reviews/:reviewsId", isLogIn, isReviewAuthor, wrapAsync(reviewController.deletingReview))

module.exports = router;