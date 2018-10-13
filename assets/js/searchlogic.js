$(document).ready(function () {

    var controUrl ="https://cryptocontrol.io/api/v1/public/";
    var cky= "?key=10bb5802424ae0f76d10089201fa0ca6";
      var cparamnwsen="news/coin/";

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
        $(document).on("click", ".close",function(){
            $(".modal").hide();
          }); 

        $(document).keypress(function(e) {

        //if the pressed key is entered, start looking for the new currency, but first validate
        if(e.which == 13) {

            console.log("entra cuando hago enter");
            
            if($('#searchVal').val()!==""){
            var searchTerm=($('#searchVal').val()).charAt(0).toUpperCase() + (($('#searchVal').val()).slice(1)).toLowerCase();
            $('#searchVal').val("");
            var searchParam=($('#searchVal').val()).toLowerCase();
            console.log(searchTerm);
            }
            function pageResults (cryptoData) {
                console.log("2");
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
          
                
                
                }};

                $(document).on("click", ".close",function(){
        $(".modal").hide();
      }); 
                  
                

            database.ref().once('value', function(snapshot) {
                if (snapshot.hasChild(searchTerm)) {
                  
                   
                    //var lowerCaseTerm=searchTerm.toLowerCase();
                    console.log(searchTerm)
                    console.log("3")
                  $.ajax({
                    //aca hay que pasar el searchTerm A lowercase
                    url: controUrl+cparamnwsen+searchTerm+cky,
                    method: 'GET',
                    
                  }).then(pageResults);
                  
                  }

                else {
                    $("#non_existent").show();
                    
                }

                });
            }

        });
        

    });

