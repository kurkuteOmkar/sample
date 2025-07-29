const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const reviews=require("./review.js")
const imageSchema = new Schema({
    // filename: {
    //     type: String,
    //     default: "default_image"
    // },
    // url: {
    //     type: String,
    //     default: "https://picsum.photos/id/237/200/300"
    // }
    url:String,
    filename:String,
}, { _id: false });
const listingSchema=new Schema(
    {
        title:{
            type:String,
            required:true,
        },
        description:String,
        image:imageSchema,
        price:Number,
        location:String,
        country:String,
     
        reviews:   [
      {
            type:Schema.Types.ObjectId,ref:"Review"
        }],
        owner: {
            type: Schema.Types.ObjectId, 
            ref: "User", 
            required: true
        },
        role:{
            type:String,
            enum:["Trending","rooms","iconic","camping","pools","Arctics","camping"],
            default:"Trending",
        }
})
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){

    await reviews.deleteMany({})
console.log("deleted")    
}
})
const listing=mongoose.model("listing",listingSchema)
module.exports=listing;