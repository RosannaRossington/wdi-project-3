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
  var self   = this;
  var latlng = new google.maps.LatLng(crime.location.latitude, crime.location.longitude);
  
  var marker = new google.maps.Marker({
    position: latlng,
    map: self.map,
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

LondonViceApp.getTemplate = function(tpl, data, url){
  var templateUrl = "http://localhost:3000/templates/" + tpl + ".html";

  return $.ajax({
    url: templateUrl,
    method: "GET",
    dataType: "html"
  }).done(function(templateData){
    // Use the underscore .template function to parse the template
    var parsedTemplate   = _.template(templateData);
    // Fills in the <%= %>, <% %> with data
    var compiledTemplate = parsedTemplate(data);
    // Replace the html inside main with the compiled template
    $("main").html(compiledTemplate);
    // Change the URL
    console.log(url)
    // stateObj, title, url
    history.pushState(null, url, url)
  })
}

LondonViceApp.apiAjaxRequest = function(url, method, data, tpl){
  return $.ajax({
    type: method,
    url: "http://localhost:3000"+ url,
    data: data,
  }).done(function(data){
    console.log(data);
    if (tpl) return LondonViceApp.getTemplate(tpl, data, url);
  }).fail(function(response){
    LondonViceApp.getTemplate("error", null, url);
  });
}

LondonViceApp.linkClick = function(){
  // If it has a data attribute of external, then it's an external link
  var external = $(this).data("external");
  // Don't prevent the default and actually just follow the link
  if (external) return;

  // Stop the browser from following the link
  event.preventDefault();
  // Get the url from the link that we clicked
  var url = $(this).attr("href");
  // Get which template we need to render
  var tpl = $(this).data("template");
  // If there is an href defined on the a link, then get the data
  if (url) return LondonViceApp.apiAjaxRequest(url, "get", null, tpl);
  // If there isn't a href, just load the template 
  return LondonViceApp.getTemplate(tpl, null, url);
}

LondonViceApp.bindLinkClicks = function(){
  // Event delegation
  $("body").on("click", "a", this.linkClick);
}

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

  // P - bind events for header a links
  this.bindLinkClicks();

  $("form").on("submit", this.submitForm);
  $("#getUsers").on("click", this.getUsers);

}


$(function(){
  LondonViceApp.initialize()  
})

