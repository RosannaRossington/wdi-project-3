var LondonViceApp = LondonViceApp || {};

LondonViceApp.getToken = function(){
  return window.localStorage.getItem("token");
}

LondonViceApp.checkLoggedIn = function() {
  var token = this.getToken();
  return token ? true : false;
}

LondonViceApp.setToken = function(token){
  return window.localStorage.setItem('token', token)
}

LondonViceApp.saveTokenIfPresent = function(data){

  if (data.token && !LondonViceApp.getToken()) return this.setToken(data.token)


  //if (data.token) return this.setToken(data.token)

    return false;
}

LondonViceApp.setRequestHeader = function(xhr, settings){
  var token = LondonViceApp.getToken();
  if (token) return xhr.setRequestHeader("Authorization", "Bearer " + token)
}

LondonViceApp.ajaxRequest = function(method, url, data, callback) {
 
  return $.ajax({
    method: method,
    url: "http://localhost:3000/api" + url,
    data: data,
    beforeSend: this.setRequestHeader
  }).done(function(data){

    if (typeof callback === "function") callback(data);


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

LondonViceApp.getTemplate = function(tpl, data, url, callback){
  if (!LondonViceApp.checkLoggedIn() && (!(tpl == "login" || tpl == "register"))) tpl = "home";
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
    if (callback) callback();
    
    // stateObj, title, url
    history.pushState(null, url, url)
  })
}

// P - make a request to a url and render template with data
LondonViceApp.apiAjaxRequest = function(url, method, data, tpl){
  return $.ajax({
    type: method,
    url: "http://localhost:3000/api"+ url,
    data: data,
  }).done(function(data){
    LondonViceApp.saveTokenIfPresent(data);
    if (tpl) return LondonViceApp.getTemplate(tpl, data, url, LondonViceApp.buildMap);
  }).fail(function(response){
    console.log(response)
    LondonViceApp.getTemplate("error", null, url);
  });
}

LondonViceApp.linkClick = function(){
  // If it has a data attribute of external, then it's an external link
  var external = $(this).data("external");
  console.log(external)
  // Don't prevent the default and actually just follow the link
  if (external) return;
  console.log(event);
  // Stop the browser from following the link
  event.preventDefault();
 // Get the url from the link that we clicked
  var url = $(this).attr("href");
  console.log(url);
  // Get which template we need to render
  var tpl = $(this).data("template");
  console.log(tpl);
  // If there is an href defined on the a link, then get the data
  // if (url) return LondonViceApp.apiAjaxRequest(url, "get", null, tpl);
  // If there isn't a href, just load the template 
  return LondonViceApp.getTemplate(tpl, null, url);
}

LondonViceApp.formSubmit = function(){
  event.preventDefault();
  var method = $(this).attr("method");
  var url    = $(this).attr("action");
  // This is the template we want to go to AFTER the form submit
  var tpl    = $(this).data("template");
  // This gets all the data from the form, you MUST have names on the inputs
  var data   = $(this).serialize();
  console.log(data);
  return LondonViceApp.apiAjaxRequest(url, method, data, "home");
}

LondonViceApp.addLinkClicks = function(){
  // Event delegation
  $("body").on("click", "a", this.linkClick);
  $("body").on("click", ".closeButton", function() {
    $("#popup").addClass("offscreen") 
  });
}

LondonViceApp.bindFormSubmits = function(){
  // Event delegation
  $("body").on("submit", "form", this.formSubmit);
}

LondonViceApp.initialize = function(){

  // P - add events for header a links
  this.addLinkClicks();

  this.bindFormSubmits();

  // $("form").on("submit", this.submitForm);
  // $("#getUsers").on("click", this.getUsers);
  $("#getUsers").on("click", this.getUsers);

}

$(function(){
  LondonViceApp.initialize()
})

