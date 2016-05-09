var rp       = require("request-promise");
var Crime    = require("./models/crime");
var mongoose = require("mongoose");
var config   = require("./config/config");

mongoose.connect(config.database)

var url = "https://data.police.uk/api/crimes-street/all-crime?poly=52.268,0.543:52.794,0.238:52.130,0.478&date=2013-01"

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