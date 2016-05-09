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
  console.log(data)
  return LondonViceApp.ajaxRequest(method, url, data);
}

LondonViceApp.getUsers = function(){
    return LondonViceApp.ajaxRequest("get", "/users");
}

LondonViceApp.initialize = function(){
  $("form").on("submit", this.submitForm);
  $("#getUsers").on("click", this.getUsers);
}

// $(function(){
//   $.ajax({
//     type: "GET",
//     url: "http://localhost:3000/api/crimes"
//   }).done(function(data){
//     console.log(data.crimes);
//   });
// });

LondonViceApp.initialize = function(){
  this.canvas = document.getElementById('map-canvas');

  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(51.506178,-0.088369),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  this.map = new google.maps.Map(this.canvas, mapOptions);
};








$(function(){
  LondonViceApp.initialize()  
})

