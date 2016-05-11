//All map functions in here
var LondonViceApp = LondonViceApp || {};

LondonViceApp.map;
LondonViceApp.categories = [];
LondonViceApp.markers    = [];
LondonViceApp.crimes     = [];
LondonViceApp.activeCircle;

// ON CLICKING A MARKER, USE GOOGLE GEOMETRIES TO RENDER DYNAMIC GRAPH
// Add a circle with radius 1000
// var circle = new.google.maps.Circle({
//   map: map
//   radius: // set radius here
//   fillColor:
// })

// bindTo('center',marker, 'position') circle centre to marker 

// do a loop on each of the markers passing in each marker as an argument

// if the poly.containsLocation(marker.getPosition(), poly, 3?) console.log those markers as crimes?

// (could also do a computeDistanceBetween() function on all of the markers)


//before we get into that try getting all of the markers at a given point
//called inside the build map function
// LondonViceApp.initializeCircle = function(lat, lng, marker) {
//   var map = LondonViceApp.map;

//   var markerRadius = new google.maps.Circle({
//     center: {lat: lat, lng: lng},
//     map: map,
//     radius: 1000, // set radius here
//     fillColor: '#FF0000',
//     fillOpacity: 0.15
//   });

  //add an event listener on all markers to remove make the var centerOfCirle = null

  // google.maps.event.addListener(map, 'click', function(event) {
  //   console.log(google.maps.geometry.poly.containsLocation(event.latLng ///this needs to the be the centre of each marker on a loop if true the marker needs to be console logged as a crime object///, centerOfLondon));
  // });
// }

//every time a user clicks on a marker we need to remove any previously drawn circle
LondonViceApp.removeCircle = function(circle){
  LondonViceApp.activeCircle = null
}

LondonViceApp.setMapOnAllCircle = function(map){
    LondonViceApp.activeCircle.setMap(map);
}

// Removes the circle from the map, but keeps the .
LondonViceApp.clearCircle = function() {
  LondonViceApp.setMapOnAllCircle(null);
}

// Deletes the circle and removes from 
LondonViceApp.deleteCircles = function() {
  LondonViceApp.clearCircle();
  LondonViceApp.removeCircle();
  // LondonViceApp.markers = [];
}



// Sets the map on all markers in the array.
LondonViceApp.setMapOnAll = function(map) {
  for (var i = 0; i < LondonViceApp.markers.length; i++) {
    LondonViceApp.markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
LondonViceApp.clearMarkers = function() {
  LondonViceApp.setMapOnAll(null);
}

// Shows any markers currently in the array.
LondonViceApp.showMarkers= function() {
  LondonViceApp.setMapOnAll(LondonViceApp.map);
}

// Deletes all markers in the array by removing references to them.
LondonViceApp.deleteMarkers = function() {
  LondonViceApp.clearMarkers();
  LondonViceApp.markers = [];
}

LondonViceApp.setupFilters = function(){
  LondonViceApp.loopThroughCrimes(LondonViceApp.crimes);
  
  $("input[type=checkbox]").on("change", function(){
    var category = $(this)[0].id;

    if ($(this)[0].checked) { 

      // Ensuring that if the all-crime checkbox is clicked, then there should be no other checkboxes clicked. If the all-crime checkbox is already clicked and you click on another checkbox then the all-crime checkbox should become unchecked.
      if (category === "all-crime") {
        $("input[type=checkbox]:checked").not(":eq(0)").trigger("click");
        return LondonViceApp.loopThroughCrimes(LondonViceApp.crimes)
      } else {
        if ($("input[type=checkbox]").first()[0].checked === true) {
          $("input[type=checkbox]").first().trigger("click");
        }
      }

      LondonViceApp.categories.push(category);
    } else {
      if (category === "all-crime") return LondonViceApp.deleteMarkers();

      var index = LondonViceApp.categories.indexOf(category);
      if (index !== -1) {
        LondonViceApp.categories.splice(index, 1);
      }
    }

    LondonViceApp.deleteMarkers();

    var filteredCrimes = LondonViceApp.filterCrimes();
    LondonViceApp.loopThroughCrimes(filteredCrimes);
  })
}

LondonViceApp.filterCrimes = function(){
  return this.crimes.filter(function(crime){
    return LondonViceApp.categories.indexOf(crime.category) !== -1;
  })
}

LondonViceApp.streetView = function (markerLat, markerLng) {
  var markerLocation = {lat: markerLat, lng: markerLng};
  var pano = document.getElementById('pano');

  var panorama = new google.maps.StreetViewPanorama(
    document.getElementById('pano'), {
      position: markerLocation,
      pov: {
        heading: 34,
        pitch: 8         
      },
      linksControl: false,
      panControl: false,
      enableCloseButton: false,
      addressControl: false,
      fullscreenControl: false,
      zoomControl: false
    });

  window.setInterval(function() {
    var pov = panorama.getPov();
    pov.heading += 0.2;
    panorama.setPov(pov);
  }, 10);

}

LondonViceApp.addInfoForCrime = function(crime, marker){
  var self = this;

  google.maps.event.addListener(marker, 'click', function() {
    var markerRadius;    
    var map            = LondonViceApp.map;
    var markerLat      = crime.location.latitude;
    var markerLng      = crime.location.longitude;
    var center         = new google.maps.LatLng(markerLat, markerLng)
    var statusCategory = crime.outcomeStatus ? crime.outcomeStatus.category : "Status unknown";

    $("#popup").removeClass("offscreen")
    $(".crimeTitle").children().remove();
    $(".streetView").children().remove();
    $(".crimeTitle").append("<h4>"+crime.category+"</h4>");
    $(".crimeTitle").append("<h4>"+crime.location.street.name+"</h4>");
    $(".crimeTitle").append("<h4>"+statusCategory+"</h4>");
    $(".streetView").append("<p>"+crime.locationType+"</p>");

    LondonViceApp.streetView(markerLat, markerLng)

    // draw a circle on the clicked crime?

    if (!!LondonViceApp.activeCircle) {LondonViceApp.deleteCircles();}

    
    var markerRadius = new google.maps.Circle({
      center: {lat: markerLat, lng: markerLng},
      map: map,
      radius: 2000, // set radius here
      fillColor: '#FF0000',
      fillOpacity: 0.15,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 0.4
    })
    
    self.activeCircle = markerRadius;
    markerRadius.bindTo('center',marker,'position');
    console.log(self.activeCircle);

  });
};



LondonViceApp.createMarkerForPlace = function(){

  var self    = this;
  var placelatlng = [
  {lat: 51.49676350000001, lng: 0.09280100000000857},
  {lat: 51.4519646,        lng: -0.12471099999993385},
  {lat: 51.4415147,        lng: -0.4340750000000071},
  {lat: 51.5538514,        lng: -0.12423079999996389},
  {lat: 51.4980346,        lng: 0.09374030000003586},
  {lat: 51.5442212,        lng: -0.11698330000001533},
  {lat: 51.49344960000001, lng: 0.08750620000000708},
  {lat: 51.449138,         lng: -0.17466569999999138},
  {lat: 51.516023,         lng: -0.24048259999995025}
  ];

  for (i = 0; i < placelatlng.length; i++){
    var latlng = new google.maps.LatLng(placelatlng[i].lat, (placelatlng[i]).lng);
    var marker = new google.maps.Marker({

      position: latlng,
      map: self.map,
      // animation: google.maps.Animation.DROP,
      icon: { 
        url: "images/prison.png",
        // scaledSize: new google.maps.Size(50, 50),
        // origin: new google.maps.Point(0,0),
        // anchor: new google.maps.Point(0, 0)
      }
    });    
  }
}


LondonViceApp.createMarkerForCrime = function(crime) {
  var self    = this;
  var lat     = crime.location.latitude;
  var lng     = crime.location.longitude;
  var latlng  = new google.maps.LatLng(crime.location.latitude, crime.location.longitude);

  var setIcon; 
  switch(crime.category) {
    case "all-crime":             setIcon = "images/all-crime.png"; break;
    case "anti-social-behaviour": setIcon = "images/anti-social.png"; break;
    case "bicycle-theft":         setIcon = "images/bicycle-theft.png"; break;
    case "burglary":              setIcon = "images/burglary.png"; break;
    case "criminal-damage-arson": setIcon = "images/fire.png"; break;
    case "drugs":                 setIcon = "images/drugs.png"; break;
    case "other-theft":           setIcon = "images/theft.png"; break;
    case "posession-of-weapons":  setIcon = "images/weapons.png"; break;
    case "public-order":          setIcon = "images/public-order.png"; break;
    case "robbery":               setIcon = "images/robbery.png"; break;
    case "shop-lifting":          setIcon = "images/shop-lifting.png"; break;
    case "theft-from-the-person": setIcon = "images/theft-person.png"; break;
    case "vehicle-crime":         setIcon = "images/vehicle-crime.png"; break;
    case "violent-crime":         setIcon = "images/violence.png"; break;
    case "other-crime":           setIcon = "images/all-crime.png"; break;
    default:                      setIcon = "images/all-crime.png";
  };

  var crimeIcon = { 
    url:        setIcon,

    // scaledSize: new google.maps.Size(0, 50),   // scaled size
    // origin:     new google.maps.Point(0, 0),   // origin
    // anchor:     new google.maps.Point(0, 0)   // anchor
  }

  var marker = new google.maps.Marker({
    position:  latlng,
    map:       self.map,
    // animation: google.maps.Animation.DROP,
    icon:      crimeIcon
  });

  self.markers.push(marker);
  this.addInfoForCrime(crime, marker);

  //draw circle on each marker - now each crime has a radius when the page loads
  // LondonViceApp.initializeCircle(lat,lng)
};

LondonViceApp.loopThroughCrimes = function(data){
  for (i = 0; i < data.length; i++){
    var crime = data[i] 
    LondonViceApp.createMarkerForCrime(crime);
  }

};

LondonViceApp.getCrimes = function(){
  var self = this;

  return LondonViceApp.ajaxRequest("get", "/crimes", null, function(data){
    LondonViceApp.crimes = data.crimes;
    return (function() {
      LondonViceApp.setupFilters();
    })();
  })


  // return LondonViceApp.ajaxRequest("get", "/crimes")
  // .done(self.loopThroughCrimes);

};

LondonViceApp.buildMap = function() {
  this.canvas = document.getElementById('map-canvas');

  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(51.506178,-0.088369),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{"featureType":"all","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#e2403d"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"transit","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"transit.station","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#242f42"},{"lightness":17}]}],

    //styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
    streetViewControl: false
  };


  LondonViceApp.map = new google.maps.Map(this.canvas, mapOptions);

  LondonViceApp.getCrimes();
  LondonViceApp.createMarkerForPlace();
  LondonViceApp.showMarkers();
  // P - to get all the grimes in london, need to define circle - passing in lat and lng (center of the map) and run readCrimes function on these
  // LondonViceApp.initializeCircle(lat,lng);
}

$(function(){
  if (LondonViceApp.checkLoggedIn()) {
    LondonViceApp.getTemplate("home", null, "home", LondonViceApp.buildMap);
  }

});


