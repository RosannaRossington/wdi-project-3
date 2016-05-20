var rp       = require("request-promise");
var Crime    = require("./models/crime");
var mongoose = require("mongoose");
var config   = require("./config/config");

mongoose.connect(config.database, function(){
  console.log("Connected")
})

var urls = [
  "https://data.police.uk/api/crimes-street/all-crime?poly=51.68617954855625,-0.0487518310546875:51.68021937787971,0.1229095458984375:51.50788772102843,-0.1187896728515625&date=2016-02",
  "https://data.police.uk/api/crimes-street/all-crime?poly=51.50959718054336,-0.1187896728515625:51.67851632786214,0.1256561279296875:51.613752957501,0.2588653564453125&date=2016-02",
  "https://data.police.uk/api/crimes-street/all-crime?poly=51.508742458803326,-0.1201629638671875:51.61119461048402,0.2561187744140625:51.47197425351889,0.2629852294921875&date=2016-02",
  "https://data.police.uk/api/crimes-street/all-crime?poly=51.50959718054336,-0.1187896728515625:51.45914115860512,0.2478790283203125:51.36492148825955,0.1544952392578125&date=2016-02",
  "https://data.police.uk/api/crimes-street/all-crime?poly=51.50959718054336,-0.1201629638671875:51.26277419739382,-0.0624847412109375:51.28682931559992,0.1311492919921875:51.38635210111939,0.1833343505859375&date=2016-02",
  "https://data.police.uk/api/crimes-street/all-crime?poly=51.265352133925376,-0.0597381591796875:51.29026473296335,-0.2753448486328125:51.49164465653034,-0.1201629638671875&date=2016-02",
  "https://data.police.uk/api/crimes-street/all-crime?poly=51.30142806450288,-0.3028106689453125:51.32460477256676,-0.4346466064453125:51.50532341149336,-0.1187896728515625&date=2016-02",
  "https://data.police.uk/api/crimes-street/all-crime?poly=51.39920565355378,-0.5348968505859375:51.3254629443313,-0.4621124267578125:51.50532341149336,-0.1284027099609375:51.49420973579561,-0.4854583740234375&date=2016-02",
  "https://data.police.uk/api/crimes-street/all-crime?poly=51.49933946133651,-0.1270294189453125:51.49762961696846,-0.4950714111328125:51.6180165487737,-0.5197906494140625&date=2016-02",
  "https://data.police.uk/api/crimes-street/all-crime?poly=51.71681946274873,-0.3783416748046875:51.50959718054336,-0.1132965087890625:51.630804919553746,-0.5156707763671875&date=2016-02",
  "https://data.police.uk/api/crimes-street/all-crime?poly=51.51301590715673,-0.1284027099609375:51.712565159815114,-0.3824615478515625:51.68277383281325,-0.1778411865234375&date=2016-02",
  "https://data.police.uk/api/crimes-street/all-crime?poly=51.50959718054336,-0.1160430908203125:51.68788231035757,-0.1654815673828125:51.68788231035757,-0.0487518310546875&date=2016-02"
]

function getCrimes(){
  Crime.collection.drop();
  urls.forEach(function(url) {
    return rp(url)
    .then(function(data) {
      var data = JSON.parse(data);
      console.log(data);
      var i = 0;
      data.forEach(function(crime){
        if (i % 500 === 0) {
          var outcomeStatus = crime.outcome_status || "";
          var newCrime = {
            category: crime.category,
            locationType: crime.location_type,
            location: {
              latitude: crime.location.latitude,
              street: {
                id: crime.location.street.id,
                name: crime.location.street.name
              },
              longitude: crime.location.longitude
            },
            context: crime.context,
            outcomeStatus: outcomeStatus,
            persistent_id: crime.persistent_id,
            externalId: crime.id,
            location_subtype: crime.location_subtype,
            month: crime.month
          }

          Crime.create(newCrime, function(err, crime) {
            if (err) return console.log(err);
            console.log("Crime created");
          })
        }
        i++;
      })

      if (i === data.length) return process.exit();
    })
    .catch(function(err) {
      console.log("Something went wrong...", err)
    });
  })
}

task('default', getCrimes);
