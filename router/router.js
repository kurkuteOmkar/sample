const express=require("express")
const router=express.Router();
const wrapAsync = require("../wrapAsync.js")
const listingController=require("../controller/listings.js")
const {isLogIn,isOwner,validateListing}=require("../middleware.js")
const multer=require(`multer`)
const {storage}=require("../cloudConfig.js")
const upload=multer({storage})
//Index Route
router.get("/", (listingController.index))

//Serach Route
router.get("/search",wrapAsync(listingController.searchPost))
//Creating new Listing Route
router.get("/new",isLogIn, listingController.renderNewForm)

//Posting new Listing
router.post("/", isLogIn,validateListing,upload.single(`listing[image][url]`),wrapAsync(listingController.postNewForm))

//Show Particular Post Route
router.get("/:id", wrapAsync(listingController.showParticularListing))

//Edit listing Route
router.get("/:id/edit", isLogIn,isOwner,wrapAsync(listingController.editListing))

//Posting the Edited Route
router.put("/:id",isLogIn,isOwner, validateListing,  upload.single("image"),wrapAsync((listingController.putEditListing)))
//Delete Route
router.delete("/:id",isLogIn,isOwner,wrapAsync(listingController.deleteListing))

//exports
module.exports=router



