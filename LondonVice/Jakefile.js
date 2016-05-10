var rp       = require("request-promise");
var Crime    = require("./models/crime");
var mongoose = require("mongoose");
var config   = require("./config/config");

mongoose.connect(config.database)

var url = "https://data.police.uk/api/crimes-street/all-crime?poly=51.533,0.244:51.543,0.038:51.449,0.033&date=2016-02"

function getCrimes(){
  return rp(url)
  .then(function(data) {
    var data = JSON.parse(data);
    console.log(data);

    data.forEach(function(crime){
      // Check whether there is a crime with that id (external_id)


      var newCrime = {
        category: crime.category,
        locationType: crime.location_type,
        location: {
          latitude: crime.location.latitude,
          longitude: crime.location.longitude
        }
      }

      Crime.create(newCrime, function(err, crime) {
        if (err) return console.log(crime);
        console.log("Crime was added to the database");
      })
    })
  })
  .catch(function(err) {
    console.log("Something went wrong...", err)
  });
}


desc('Something funny to describe task...');
task('default', getCrimes);