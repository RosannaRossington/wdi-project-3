//All map functions in here
var LondonViceApp = LondonViceApp || {};

LondonViceApp.map;
LondonViceApp.categories = [];
LondonViceApp.markers    = [];
LondonViceApp.crimes     = [];

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
    var markerLat = crime.location.latitude;
    var markerLng = crime.location.longitude;
    var statusCategory = crime.outcomeStatus ? crime.outcomeStatus.category : "Status unknown";
    var setCrimeCategory; 
    switch(crime.category) {
      case "all-crime":             setCrimeCategory = "All crimes"; break;
      case "anti-social-behaviour": setCrimeCategory = "Anti Social Behaviour"; break;
      case "bicycle-theft":         setCrimeCategory = "Bicycle Theft"; break;
      case "burglary":              setCrimeCategory = "Burglary"; break;
      case "criminal-damage-arson": setCrimeCategory = "Criminal Damage/Arson"; break;
      case "drugs":                 setCrimeCategory = "Drugs"; break;
      case "other-theft":           setCrimeCategory = "Other theft"; break;
      case "posession-of-weapons":  setCrimeCategory = "Posession Of Weapons"; break;
      case "public-order":          setCrimeCategory = "Public Order"; break;
      case "robbery":               setCrimeCategory = "Robbery"; break;
      case "shop-lifting":          setCrimeCategory = "Shoplifting"; break;
      case "theft-from-the-person": setCrimeCategory = "Theft from the person"; break;
      case "vehicle-crime":         setCrimeCategory = "Vehicle Crime"; break;
      case "violent-crime":         setCrimeCategory = "Violent Crime"; break;
      case "other-crime":           setCrimeCategory = "Other crime"; break;
    };

      $("#popup").removeClass("offscreen")
      $(".crimeTitle").children().remove();
      $(".streetView").children().remove();
      $(".crimeTitle").append("<h4><span id='popTitle'>Crime type: </span>"+setCrimeCategory+"</h4>");
      $(".crimeTitle").append("<h4><span id='popTitle'>Location: </span>"+crime.location.street.name+"</h4>");
      $(".crimeTitle").append("<h4><span id='popTitle'>Status: </span>"+statusCategory+"</h4>");
 
      $(".streetView").append("<p>"+crime.locationType+"</p>");

    LondonViceApp.streetView(markerLat, markerLng)

  });
};

LondonViceApp.createMarkerForPlace = function(){

  var self    = this;
  LondonViceApp.prisons = [
    {name: "Belmarsh", lat: 51.49676350000001, lng: 0.09280100000000857},
    {name: "Brixton", lat: 51.4519646,        lng: -0.12471099999993385},
    {name: "Feltham", lat: 51.4415147,        lng: -0.4340750000000071},
    {name: "Holloway", lat: 51.5538514,        lng: -0.12423079999996389},
    {name: "Isis Thamesmead", lat: 51.4980346,        lng: 0.09374030000003586},
    {name: "Pentonville", lat: 51.5442212,        lng: -0.11698330000001533},
    {name: "Thameside", lat: 51.49344960000001, lng: 0.08750620000000708},
    {name: "Wandsworth", lat: 51.449138,         lng: -0.17466569999999138},
    {name: "Wormwood Scrubs", lat: 51.516023,         lng: -0.24048259999995025}
  ];

  for (i = 0; i < LondonViceApp.prisons.length; i++){
    var latlng = new google.maps.LatLng(LondonViceApp.prisons[i].lat, (LondonViceApp.prisons[i]).lng);
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
    streetViewControl: false
    };

  // document.getElementById('start').addEventListener('change', onChangeHandler)
  LondonViceApp.map = new google.maps.Map(this.canvas, mapOptions);
  LondonViceApp.directionsService = new google.maps.DirectionsService;
  LondonViceApp.directionsDisplay = new google.maps.DirectionsRenderer;
  LondonViceApp.getCrimes();
  LondonViceApp.createMarkerForPlace();
  LondonViceApp.populatePrisonSelect();
  LondonViceApp.showMarkers();
}

LondonViceApp.onChangeHandler = function() {
  var directionsService = LondonViceApp.directionsService;
  var directionsDisplay = LondonViceApp.directionsDisplay;
  LondonViceApp.calculateAndDisplayRoute(directionsService, directionsDisplay);
}

LondonViceApp.populatePrisonSelect = function() {
  $(".prisonDest").append("<select id='end'></select>");
  $.each(LondonViceApp.prisons, function(index, prison) {
    console.log(prison);
    $("select#end").append("<option value='"+index+"'>"+prison.name+"</option>");
  })
  document.getElementById('end').addEventListener('change', LondonViceApp.onChangeHandler);
}




LondonViceApp.calculateAndDisplayRoute = function(directionsService, directionsDisplay) {

  var optionLatLng = document.getElementById("end").value;
  var prison = LondonViceApp.prisons[optionLatLng];
  var origin = new google.maps.LatLng(51.516023, -0.24048259999995025);
  var destination = new google.maps.LatLng(prison.lat, prison.lng);
  directionsService.route({
    origin: origin,
    destination: destination,
    travelMode: google.maps.TravelMode.WALKING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setMap(LondonViceApp.map);
      directionsDisplay.setDirections(response);
      console.log(response)
    } else {
      console.log('Directions request failed due to ' + status);
    }
  });
}









$(function(){
  if (LondonViceApp.checkLoggedIn()) {
    LondonViceApp.getTemplate("home", null, "home", LondonViceApp.buildMap);
  }
});


