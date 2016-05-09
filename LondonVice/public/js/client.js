var LondonViceApp = LondonViceApp || {};

LondonViceApp.getToken = function(){
  return window.localStorage.getItem("token");
}

LondonViceApp.setToken = function(token){
  return window.localStorage.setItem('token', token)
}

LondonViceApp.saveTokenIfPresent = function(data){
  if (data.token) return this.setToken(data.token)
    return false;
}

LondonViceApp.setRequestHeader = function(xhr, settings){
  var token = LondonViceApp.getToken();
  if (token) return xhr.setRequestHeader("Authorization", "Bearer " + token)
}

LondonViceApp.ajaxRequest = function(method, url, data) {
  return $.ajax({
    method: method,
    url: "http://localhost:3000/api" + url,
    data: data,
    beforeSend: this.setRequestHeader
  }).done(function(data){
    console.log(data);
    return LondonViceApp.saveTokenIfPresent(data);
  }).fail(function(data){
    console.log(data.responseJSON.message);
  });
}

LondonViceApp.submitForm = function(){
  event.preventDefault();

  var method = $(this).attr('method');
  var url    = $(this).attr("action");
  var data   = $(this).serialize();
  
  return LondonViceApp.ajaxRequest(method, url, data);
}

LondonViceApp.getUsers = function(){
    return LondonViceApp.ajaxRequest("get", "/users");
}

LondonViceApp.createMarkerForCrime = function(crime) {
  var self    = this;
  var latlng  = new google.maps.LatLng(crime.location.latitude, crime.location.longitude);
  var setIcon;
    switch(crime.category) {
      case "burglary": setIcon = "images/robbery.png"; break;
      case "vehicle-crime": setIcon = "images/vehicle.jpg"; break;
      case "shoplifting": setIcon = "images/theft.png"; break;
      default: setIcon = "images/fire.png";
    }
  console.log (crime.category) 
   // if (crime.category == "burglary") {
   //      var marker = new google.maps.Marker({

   //        position: latlng,
   //        map: self.map,
   //        animation: google.maps.Animation.DROP,
   //        icon: "/images/robbery.png"
   //      });
   //  }
   //  else {
   //    var marker = new google.maps.Marker({

   //      position: latlng,
   //      map: self.map,
   //      animation: google.maps.Animation.DROP,
   //      icon: "/images/fire.png"
   //    });
   //  }
   var marker = new google.maps.Marker({

   position: latlng,
   map: self.map,
   animation: google.maps.Animation.DROP,
   icon: setIcon
   });
};

LondonViceApp.loopThroughCrimes = function(data){
  return $.each(data.crimes, function(i, crime){
    LondonViceApp.createMarkerForCrime(crime);
  });
};

LondonViceApp.getCrimes = function(){
  var self = this;
  return LondonViceApp.ajaxRequest("get", "/crimes")
    .done(self.loopThroughCrimes);;
};

LondonViceApp.initialize = function(){
  
  this.canvas = document.getElementById('map-canvas');

  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(51.506178,-0.088369),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{"featureType":"road","elementType":"geometry.fill","stylers":[{"lightness":-100}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"lightness":-100},{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"lightness":100}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"saturation":100},{"hue":"#006eff"},{"lightness":-19}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"saturation":-100},{"lightness":-16}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"hue":"#2bff00"},{"lightness":-39},{"saturation":8}]},{"featureType":"poi.attraction","elementType":"geometry.fill","stylers":[{"lightness":100},{"saturation":-100}]},{"featureType":"poi.business","elementType":"geometry.fill","stylers":[{"saturation":-100},{"lightness":100}]},{"featureType":"poi.government","elementType":"geometry.fill","stylers":[{"lightness":100},{"saturation":-100}]},{"featureType":"poi.medical","elementType":"geometry.fill","stylers":[{"lightness":100},{"saturation":-100}]},{"featureType":"poi.place_of_worship","elementType":"geometry.fill","stylers":[{"lightness":100},{"saturation":-100}]},{"featureType":"poi.school","elementType":"geometry.fill","stylers":[{"saturation":-100},{"lightness":100}]},{"featureType":"poi.sports_complex","elementType":"geometry.fill","stylers":[{"saturation":-100},{"lightness":100}]}]
  };

  this.map = new google.maps.Map(this.canvas, mapOptions);
  this.getCrimes();

  $("form").on("submit", this.submitForm);
  $("#getUsers").on("click", this.getUsers);
}


$(function(){
  LondonViceApp.initialize()  
})

