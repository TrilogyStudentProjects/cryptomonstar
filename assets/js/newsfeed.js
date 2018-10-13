$(document).ready(function () {

    var controlUrl ="get_data.php";
    var ckey= "?key=10bb5802424ae0f76d10089201fa0ca6";

      var cparamtweets ="tweets/coin/";
      var cparamdetails="details/coin/";
      var cparamnewsen="news/coin/";
      var cparamreddit="reddit/coin/";
      var cparamtwitter="tweets/coin/";
      var cparamfeed="feed/coin/";
      //var cparamnewses="news?language=es/coin/";
      var cparamnewscat="news/category?language=en"; //Analysis, Blockchain, Exchanges, Government, Mining & ICOs
        var catan="Analysis"; 
        var catblock="Blockchain";
        var catexh="Exchanges";
        var catgov="Government";
        var catmin="Mining";
        var catico="ICO";

      var coin="bitcoin";

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
    
    //news Section
    $("#news").on("click", function (event){
          event.preventDefault();      
          queryUrl = controlUrl+cparamnewsen+coin+ckey;
        $.ajax({
          url:queryUrl,
          method: "GET"
        }).then(updatePage);
      });
    
    //news category
    $("#newscat").on("click", function (event){
        event.preventDefault();      
        queryUrl = controlUrl+cparamnewsen+coin+ckey; //aqui podemos usar catan, catblock, catexh,catgov,catmin, catico
      $.ajax({
        url:queryUrl,
        method: "GET"
      }).then(updatePage);
    });

    //feed 
    /*
    $("#feed").on("click", function (event){
          event.preventDefault();      
          queryUrl = controlUrl+cparamfeed+coin+ckey;
          console.log(queryUrl);
        $.ajax({
          url:queryUrl,
          method: "GET"
      }).then(updatePage);
    });*/

    //reddit posts
    $("#reddit").on("click", function (event){
        event.preventDefault();      
        queryUrl = controlUrl+cparamreddit+coin+ckey;
        console.log(queryUrl);
      $.ajax({
        url:queryUrl,
        method: "GET"
    }).then(updatePagereddit);
    });

    //Tweets post
    $("#tweets").on("click", function (event){
        event.preventDefault();      
        queryUrl = controlUrl+cparamtwitter+coin+ckey;
        console.log(queryUrl);
      $.ajax({
        url:queryUrl,
        method: "GET"
    }).then(updatePageTwitter);
    });

    //Coin details
    $("#details").on("click", function (event){
            event.preventDefault();      
            queryUrl = controlUrl+cparamdetails+coin+ckey;
            console.log(queryUrl);
        $.ajax({
            url:queryUrl,
            method: "GET"
        }).then(updatePage);
      });


function createCard(cryptoDetails){
    $("details-section").empty();
    
}

function updatePage(cryptoData) {
    console.log(cryptoData);
      $("#article-section").empty();
      
      for(var i=1;i<=10;i++){
        var card=$("<div>");
        card.addClass("card");
        var cardBody=$("<div>");
        cardBody.addClass("card-body");
        var title=$("<a href="+cryptoData[i].url+">").text(i+". "+cryptoData[i].title);
        title.addClass("card-title");
        var subtitle=$("<h6>").text("Description "+cryptoData[i].description);
        subtitle.addClass("card-subtitle mb-2 text-muted");

        
        var published=$("<p>").text("Details");
        published.addClass("card-text");
        published.append("<br>");
        published.append("Published: "+cryptoData[i].publishedAt+" // Domain: "+cryptoData[i].sourceDomain+" // Category: "+cryptoData[i].primaryCategory+"");
        
        card.addClass("col-lg-12 col-md-12 col-sm-12");
        card.append(title).append(subtitle).append(published);

        $("#article-section").append(card);
        var br=$("<br>");
        $("#article-section").append(br);
      }
    }  

  function updatePagereddit(cryptoData) {
    console.log(cryptoData);
      $("#article-section").empty();
      
      for(var i=1;i<=10;i++){
        var card=$("<div>");
        card.addClass("card");
        var cardBody=$("<div>");
        cardBody.addClass("card-body");
        var title=$("<a href="+cryptoData[i].url+">").text(i+". "+cryptoData[i].title);
        title.addClass("card-title");
        var subtitle=$("<h6>").text("Description: "+cryptoData[i].description);
        subtitle.addClass("card-subtitle mb-2 text-muted");

        
        var published=$("<p>").text("Details");
        published.addClass("card-text");
        published.append("<br>");
        published.append("Updated: "+cryptoData[i].updatedAt+" // Subreddit: "+cryptoData[i].subreddit+" // Upvotes: "+cryptoData[i].upvotes+"");
        
        card.addClass("col-lg-12 col-md-12 col-sm-12");
        card.append(title).append(subtitle).append(published);

        $("#article-section").append(card);
        var br=$("<br>");
        $("#article-section").append(br);
      }
    }  

    function updatePageTwitter(cryptoData) {
      console.log(cryptoData);
        $("#article-section").empty();
        
        for(var i=1;i<=10;i++){
          var card=$("<div>");
          card.addClass("card");
          var cardBody=$("<div>");
          cardBody.addClass("card-body");
          var title=$("<a href="+cryptoData[i].url+">").text(i+". "+cryptoData[i].links);
          title.addClass("card-title");
          var subtitle=$("<h6>").text("Description: "+cryptoData[i].text);
          subtitle.addClass("card-subtitle mb-2 text-muted");
  
          
          var published=$("<p>").text("Details");
          published.addClass("card-text");
          published.append("<br>");
          published.append("Updated: "+cryptoData[i].updatedAt+" // Retweets: "+cryptoData[i].retweetCount+" // Hashtags: "+cryptoData[i].hastags+"");
          
          card.addClass("col-lg-12 col-md-12 col-sm-12");
          card.append(title).append(subtitle).append(published);
  
          $("#article-section").append(card);
          var br=$("<br>");
          $("#article-section").append(br);
        }
      }  
      function clear() {
        $("#article-section").empty();
        //este ya funciona correctamente
      }
      $("#clear-all").on("click", clear);


});
