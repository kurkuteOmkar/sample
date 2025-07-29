const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongoUrl = "mongodb://127.0.0.1:27017/airbnb";

async function main() {
  await mongoose.connect(mongoUrl);
  console.log("MongoDB connected");
}
main();

const initDB = async () => {
  try {

      const newOwner= new mongoose.Types.ObjectId("6874ad1c1a168bc94d4ececa")
    // await Listing.deleteMany({});
    // console.log("Old listings deleted");
    // const modifiedData = initData.data.map((obj) => ({
    //   ...obj, //...obj copies all the properties from exsiting object into new object
    //   owner: new mongoose.Types.ObjectId("68513e9aa46354497b25012e"),
    // }));

    // console.log("First listing with owner:", modifiedData[0]);

    // await Listing.insertMany(modifiedData);
    await Listing.updateMany({},{owner:newOwner})
    console.log("New data inserted with owner");
  } catch (err) {
    console.error("Error during DB init:", err.message);
  } finally {
    mongoose.connection.close();
  }
};

// initDB();
const updateRoles = async () => {
  try {
    // Only set 'role' field for all listings
    const result = await Listing.updateMany(
      { role: { $exists: false } }, // optional: only update if role not set
      { $set: { role: "Trending" } } // or any default enum value
    );

    console.log(`${result.modifiedCount} listings updated with default role`);
  } catch (err) {
    console.error("Error during DB update:", err.message);
  } finally {
    mongoose.connection.close();
  }
};

updateRoles();