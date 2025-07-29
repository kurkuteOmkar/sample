const Listing = require("../models/listing.js")

// Index Route
module.exports.index = async (req, res) => {
   let allListing = await Listing.find({})
    res.render("listings/index.ejs", { allListing })
};
// showing search post
module.exports.searchPost=async(req,res)=>{
    let search=req.query.search;
    res.locals.search=search
    console.log(search)
    let countries=await Listing.find({country:search})
    console.log(countries)
    let allListing=countries
    res.render("listings/search.ejs",{countries})
}
//Create New Posting
module.exports.renderNewForm = (req, res) => {
    res.render("listings/createNew.ejs")
}
//Posting New post
module.exports.postNewForm = async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,".....",filename)
    let { listing } = req.body
    const addListings = new Listing(listing)
    addListings.image={url,filename}
    addListings.owner = req.user._id;
    await addListings.save();
    
    req.flash("success", "New Post is added Successfully")
    // console.log(addListings)
    res.redirect("/listings")
}

//Show particular Route
module.exports.showParticularListing = async (req, res) => {
    let { id } = req.params;
    let showList = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    console.log(showList)
    if (!showList) {
        req.flash("error", "Listing you requested for does not exist")
        return res.redirect("/listings")
    }
    console.log(showList)
    res.render("listings/show.ejs", { showList })
}

//Editing listing
module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const editList = await Listing.findById(id);
    if (!editList) {
        req.flash("error", "Listing you requested for does not exist")
        return res.redirect("/listings")
    }
    res.render("listings/edit.ejs", { edl: editList })
}

// Posting the edited  Route
module.exports.putEditListing = async (req, res) => {
    let { id } = req.params;
    
    let updateList = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename
    updateList.image={url,filename}
await updateList.save()
    }
    req.flash("success", "Listing Updated")
    res.redirect(`/listings/${id}`)
}

//Deleting Listing
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted")
    res.redirect("/listings")
}