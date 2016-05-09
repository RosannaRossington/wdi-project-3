var mongoose = require("mongoose");

var crimeSchema = new mongoose.Schema({
  category: String,
  locationType: String,
  location: {
    latitude: Number,
    street: {
      id: Number,
      name: String
    },
    longitude: Number
  },
  context: String,
  outcomeStatus: {
    category: String,
    date: Date
  },
  persistent_id: String,
  externalId: Number,
  location_subtype: String,
  month: Date
})


module.exports = mongoose.model("Crime", crimeSchema);