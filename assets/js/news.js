$(document).ready(function () {
 
  var queryURL = "https://cors-anywhere.herokuapp.com/https://cryptopanic.com/api/posts/?auth_token=01f6876937ec50fcfa209d5c8044ed3e46744b89&public=true&structure=array";
  var rising = "&filter=rising";
  var hot = "&filter=hot";
  var bullish = "&filter=bullish";
  var bearish = "&filter=bearish";
  var lol ="&filter=lol";

    $(function () {
      $('a[href="#search"]').on('click', function(event) {
          event.preventDefault();
          $('#search').addClass('open');
          $('#search > form > input[type="search"]').focus();
      });
      
      $('#search, #search button.close').on('click keyup', function(event) {
          if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
              $(this).removeClass('open');
          }
      });
      
      
      //Do not include! This prevents the form from submitting for DEMO purposes only!
      $('form').submit(function(event) {
          event.preventDefault();
          return false;
      })  
    });

  $.ajax({
    url:queryURL,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type':'application/json'
    },
    method: 'GET',
    dataType: 'json',
    data: '',
    success: function(data){
 

     // ============================funcion que agrega resultados a el html=====================================
    function updatePage(cryptoData) {
     
      $("#article-section").empty();
      
      for(var i=1;i<=10;i++){

        var card=$("<div>");
        card.addClass("card");
        var cardBody=$("<div>");
        cardBody.addClass("card-body");
        var title=$("<a href="+cryptoData.results[i].url+">").text(i+". "+cryptoData.results[i].title);
        title.addClass("card-title");
        var subtitle=$("<h6>").text("Retrieved from: "+cryptoData.results[i].domain);
        subtitle.addClass("card-subtitle mb-2 text-muted");

        var votes=$("<p>").text("Votes");
        votes.addClass("card-text");
        votes.append("<br>");
        votes.append("Liked: "+cryptoData.results[i].votes.liked+" // Disliked: "+cryptoData.results[i].votes.disliked+" // Important: "+cryptoData.results[i].votes.important+" // Lol: "+cryptoData.results[i].votes.lol+" // Toxic: "+cryptoData.results[i].votes.toxic);
      
        card.addClass("col-lg-12 col-md-12 col-sm-12");


        card.append(title).append(subtitle).append(votes);

        $("#article-section").append(card);
        var br=$("<br>");
        $("#article-section").append(br);

      
      
      }


    }  
     
   // ============================Boton para "clear"=====================================
  function clear() {
    $("#article-section").empty();
    //este ya funciona correctamente
  }
  $("#clear-all").on("click", clear);
  
  // ============================Boton para "rising"=====================================

  $("#rising").on("click", function (event){
    event.preventDefault();      
     queryURL = queryURL+rising; 
  $.ajax({
    url:queryURL,
    method: "GET"
  }).then(updatePage);
  });

 // ============================Boton para "hot"=====================================

$("#hot").on("click", function (event){
  event.preventDefault();      
   queryURL = queryURL+hot; 
$.ajax({
  url:queryURL,
  method: "GET"
}).then(updatePage);
});

 // ============================Boton para "bullish"=====================================

$("#bullish").on("click", function (event){
    event.preventDefault();      
     queryURL = queryURL+bullish; 
  $.ajax({
    url:queryURL,
    method: "GET"
  }).then(updatePage);
  });
 // ============================Boton para "bearish"=====================================
  $("#bearish").on("click", function (event){
    event.preventDefault();      
     queryURL = queryURL+bearish; 
  $.ajax({
    url:queryURL,
    method: "GET"
  }).then(updatePage);
  });
   // ============================Boton para "lol"=====================================

  $("#lol").on("click", function (event){
    event.preventDefault();      
     queryURL = queryURL+lol; 
  $.ajax({
    url:queryURL,
    method: "GET"
  }).then(updatePage);
  });


}})

});