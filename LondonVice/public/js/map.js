//All map functions in here
var LondonViceApp = LondonViceApp || {};

LondonViceApp.addInfoWindowForCrime = function(crime, marker){
  var self = this;

  google.maps.event.addListener(marker, 'click', function() {
    if (typeof self.infowindow != "undefined") self.infowindow.close();

    self.infowindow = new google.maps.InfoWindow({
      content: "<p>"+crime.category+"</p>"
    });
    
    self.infowindow.open(self.map, this);

  });
};

LondonViceApp.addInfoForCrime = function(crime, marker){
  var self = this;

  google.maps.event.addListener(marker, 'click', function() {
    if (typeof self.infowindow != "undefined") self.infowindow.close();

    self.infowindow = new google.maps.InfoWindow({
      content: "<p>"+crime.category+"</p>"
    });
    
    self.infowindow.open(self.map, this);

  });

  google.maps.event.addListener(marker, 'click', function() {

      $("#popup").removeClass("offscreen")
      $(".crimeTitle").children().remove();
      $(".streetView").children().remove();
      $(".crimeTitle").append("<h4>"+crime.category+"</h4>");
      $(".streetView").append("<p>"+crime.locationType+"</p>");
  });
};

LondonViceApp.createMarkerForPlace = function(place){

  var self    = this;
  var latlng = new google.maps.LatLng(51.49676350000001, 0.09280100000000857);
    // [
    // {lat: 51.49676350000001, lng: 0.09280100000000857},
    // {lat: 51.4519646, lng: -0.12471099999993385},
    // {lat: 51.4415147, lng: -0.4340750000000071},
    // {lat: 51.5538514, lng: -0.12423079999996389},
    // {lat: 51.4980346, lng: 0.09374030000003586},
    // {lat: 51.5442212, lng: -0.11698330000001533},
    // {lat: 51.49344960000001, lng: 0.08750620000000708},
    // {lat: 51.449138, lng: -0.17466569999999138},
    // {lat: 51.516023, lng: -0.24048259999995025}
    // ]
  // );

  var marker = new google.maps.Marker({

  position: latlng,
  map: self.map,
  animation: google.maps.Animation.DROP
  });

}



LondonViceApp.createMarkerForCrime = function(crime) {

  var self    = this;
  var latlng  = new google.maps.LatLng(crime.location.latitude, crime.location.longitude);
  var setIcon;  
  switch(crime.category) {
    case "all-crime": setIcon = "images/all-crime.png"; break;
    case "anti-social-behaviour": setIcon = "images/anti-social.png"; break;
    case "bicycle-theft": setIcon = "images/bicycle-theft.png"; break;
    case "burglary": setIcon = "images/burglary.png"; break;
    case "criminal-damage-arson": setIcon = "images/fire.png"; break;
    case "drugs": setIcon = "images/drugs.png"; break;
    case "other-theft": setIcon = "images/theft.png"; break;
    case "posession-of-weapons": setIcon = "images/weapons.png"; break;
    case "public-order": setIcon = "images/public-order.png"; break;
    case "robbery": setIcon = "images/robbery.png"; break;
    case "shop-lifting": setIcon = "images/shop-lifting.png"; break;
    case "theft-from-the-person": setIcon = "images/theft-person.png"; break;
    case "vehicle-crime": setIcon = "images/vehicle-crime.png"; break;
    case "violent-crime": setIcon = "images/violence.png"; break;
    case "other-crime": setIcon = "images/other-crime.png"; break;
    default: setIcon = "images/all-crime.png";
  };
  var crimeIcon = { 
    url: setIcon,

    scaledSize: new google.maps.Size(50, 50), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  }

   var marker = new google.maps.Marker({

   position: latlng,
   map: self.map,
   animation: google.maps.Animation.DROP,
   icon: crimeIcon
 });

  this.addInfoWindowForCrime(crime, marker);
  this.addInfoForCrime(crime, marker);
};

LondonViceApp.loopThroughCrimes = function(data){
  for (i = 0; i < (data.crimes).length; i++){
    var crime = data.crimes[i] 
    LondonViceApp.createMarkerForCrime(crime);
    LondonViceApp.createMarkerForPlace();
  }
};

LondonViceApp.getCrimes = function(){
  var self = this;
  return LondonViceApp.ajaxRequest("get", "/crimes")
  .done(self.loopThroughCrimes);
};

LondonViceApp.buildMap = function() {
  this.canvas = document.getElementById('map-canvas');

  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(51.506178,-0.088369),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{"featureType":"road","elementType":"geometry.fill","stylers":[{"lightness":-100}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"lightness":-100},{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"lightness":100}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"saturation":100},{"hue":"#006eff"},{"lightness":-19}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"saturation":-100},{"lightness":-16}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"hue":"#2bff00"},{"lightness":-39},{"saturation":8}]},{"featureType":"poi.attraction","elementType":"geometry.fill","stylers":[{"lightness":100},{"saturation":-100}]},{"featureType":"poi.business","elementType":"geometry.fill","stylers":[{"saturation":-100},{"lightness":100}]},{"featureType":"poi.government","elementType":"geometry.fill","stylers":[{"lightness":100},{"saturation":-100}]},{"featureType":"poi.medical","elementType":"geometry.fill","stylers":[{"lightness":100},{"saturation":-100}]},{"featureType":"poi.place_of_worship","elementType":"geometry.fill","stylers":[{"lightness":100},{"saturation":-100}]},{"featureType":"poi.school","elementType":"geometry.fill","stylers":[{"saturation":-100},{"lightness":100}]},{"featureType":"poi.sports_complex","elementType":"geometry.fill","stylers":[{"saturation":-100},{"lightness":100}]}]
  };

  LondonViceApp.map = new google.maps.Map(this.canvas, mapOptions);
  LondonViceApp.getCrimes();
}

$(function(){
  if (LondonViceApp.checkLoggedIn()) {
    LondonViceApp.getTemplate("home", null, "home", LondonViceApp.buildMap);
  }
});


