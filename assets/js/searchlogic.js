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

        $(document).on("click",function(){

            console.log("entra cuando hago enter");
            
            if($('#searchVal').val()!==""){
            var searchTerm=($('#searchVal').val()).charAt(0).toUpperCase() + (($('#searchVal').val()).slice(1)).toLowerCase();
            $('#searchVal').val("");
            var searchParam=($('#searchVal').val()).toLowerCase();
            console.log(searchTerm);
            }
            function pageResults (cryptoData) {
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
                    
                
                
                }};

                $(document).on("click", ".close",function(){
                 $(".modal").hide();
                }); 
                  
                

            database.ref().once('value', function(snapshot) {
                if (snapshot.hasChild(searchTerm)) {
                  
                   
                   var lowerCaseTerm=searchTerm.toLowerCase();
                    console.log(lowerCaseTerm)
                    
                  $.ajax({
                    url: controUrl+cparamnwsen+lowerCaseTerm+cky,
                    method: 'GET'
                    
                  }).then(pageResults);
                  console.log();
                  }

                else {
                    $("#non_existent").show();
                    
                }

                });
            })

        });
        


