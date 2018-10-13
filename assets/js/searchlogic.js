$(document).ready(function () {

    var controlUrl ="https://cryptocontrol.io/api/v1/public/";
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

        var config = {

            apiKey: "AIzaSyBuayaA5_zDiUpv9HEle0iityLJl5CAnrM",
            authDomain: "cryptomonstar.firebaseapp.com",
            databaseURL: "https://cryptomonstar.firebaseio.com",
            projectId: "cryptomonstar",
            storageBucket: "cryptomonstar.appspot.com",
            messagingSenderId: "600045610445"

        };
        firebase.initializeApp(config);
        database = firebase.database();

        $(document).keypress(function(e) {

        //if the pressed key is entered, start looking for the new currency, but first validate
        if(e.which == 13) {

            console.log("entra cuando hago enter");
            
         

            if($('#searchVal').val()!==""){
            var searchTerm=($('#searchVal').val()).charAt(0).toUpperCase() + (($('#searchVal').val()).slice(1)).toLowerCase();
            $('#searchVal').val("");
            console.log(searchTerm);
            }

            database.ref().once('value', function(snapshot) {
                if (snapshot.hasChild(searchTerm)) {
                       
                    queryUrl = controlUrl+cparamnewsen+searchTerm+ckey;
                  $.ajax({
                    url: queryUrl,
                    method: 'GET',
                  }).then(updatePages);
                }

                else{

                    alert("the cryptocurrency does not exist");
                }

               });
            }

        });
        function updatePages(cryptoData) {
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

    });

