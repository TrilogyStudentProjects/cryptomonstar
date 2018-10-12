$(document).ready(function () {

    var newsURL = "https://cors-anywhere.herokuapp.com/https://cryptopanic.com/api/posts/?auth_token=01f6876937ec50fcfa209d5c8044ed3e46744b89&public=true&structure=array";
    var bullish = "&filter=bullish";
    var bearish = "&filter=bearish";

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

    var queryURL ="https://api.coinmarketcap.com/v2";
    var param1="/ticker/?start=1&limit=4000&sort=rank&structure=array";
    var param2 ="/global/";
    console.log(queryURL+param1)
    console.log(queryURL+param2)

    $.ajax({
        url: queryURL+param1,
        method: "GET"
      })
      .then(function(response) {

        var results = response.data;

        for (var i = 0; i < results.length; i++) {

            var cryptoName=results[i].name;
            var symbol=results[i].symbol;
            var rank=results[i].rank;
            var price=math.round(results[i].quotes.USD.price);
            var percentageHour=results[i].quotes.USD.percent_change_1h;
            var percentageDay=results[i].quotes.USD.percent_change_24h;
            var percentageWeek=results[i].quotes.USD.percent_change_7d;
            
            var entry=database.ref(cryptoName);
        
            entry.update({
                cryptoName: cryptoName,
                symbol: symbol,
                rank: rank,
                price:price,
                percentageHour: percentageHour,
                percentageDay:percentageDay,
                percentageWeek:percentageWeek,
                momentAdded: firebase.database.ServerValue.TIMESTAMP
                //the moment added will be used to comapre when the information was uploaded and to decide if we need to call the API again or not
            });
            

        }


      });
      
      database.ref().on("child_added", function (childSnapshot) {
        
      if(childSnapshot.val().rank<=12){
        var card=$("<div>");
        card.addClass("card");
        var cardBody=$("<div>");
        cardBody.addClass("card-body");

        var title=$("<h5>").text(childSnapshot.val().cryptoName);
        title.addClass("card-title");
        var subtitle=$("<h6>").text(childSnapshot.val().symbol);
        subtitle.addClass("card-subtitle mb-2 text-muted");

        var rank=$("<p>").text("Rank: "+childSnapshot.val().rank);
        rank.addClass("card-text");
        rank.append("<br>");
        rank.append("Price (USD): $"+(childSnapshot.val().price).toString().substring(0,(childSnapshot.val().price).toString().indexOf('.')+3));
        rank.append("<br>");

        var hour=$("<p>");
        if (childSnapshot.val().percentageHour<=0){
            hour.append("(1h): "+childSnapshot.val().percentageHour+"%");
            hour.append("<br>");
            hour.addClass("rojo");
        }
        else{
            hour.append("(1h): "+childSnapshot.val().percentageHour+"%");
            hour.append("<br>");
            hour.addClass("verde");
        }
        var day=$("<p>");
        if (childSnapshot.val().percentageDay<=0){
            day.append("(24h): "+childSnapshot.val().percentageDay+"%");
            day.append("<br>");
            day.addClass("rojo");
        }
        else{
            day.append("(24h): "+childSnapshot.val().percentageDay+"%");
            day.append("<br>");
            day.addClass("verde");
        }
        var week=$("<p>");
        if (childSnapshot.val().percentageWeek<=0){
            week.append("(Week): "+childSnapshot.val().percentageWeek+"%");
            week.append("<br>");
            week.addClass("rojo");
        }
        else{
            week.append("(Week): "+childSnapshot.val().percentageWeek+"%");
            week.append("<br>");
            week.addClass("verde");
        }

    
       
        var link=$("<button>").text("News");
        link.attr("id",childSnapshot.val().symbol);
        link.addClass("none");
        link.addClass("row btn btn-primary");
       
        var link2=$("<button>").text("Bullish");
        link2.attr("id",childSnapshot.val().symbol);
        link2.addClass("bullish");
        link2.addClass("row btn btn-warning");

        var link3=$("<button>").text("Bearish");        
        link3.attr("id",childSnapshot.val().symbol);
        link3.addClass("bearish");
        link3.addClass("row btn btn-success");

        card.addClass("col-lg-3 col-md-6 col-sm-12 charlie");
        
        card.append(title).append(subtitle).append(rank).append(hour).append(day).append(week).append(link).append(link2).append(link3);
        card.append("<br>");

        $("#cards").append(card);}
       
    

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    $(document).on("click", ".none",function(){
        event.preventDefault(); 
        var type=$(this).attr("id");    
        newsURL = newsURL+"&currencies="+type; 
      $.ajax({
        url:newsURL,
        method: "GET"
      }).then(updatePage);
      });  
    
      $(document).on("click", ".bullish",function(){
        event.preventDefault(); 
        var type=$(this).attr("id");
        console.log("ID de la moneda: "+type);     
         newsURL = newsURL+bullish+"&currencies="+type; 
      $.ajax({
        url:newsURL,
        method: "GET"
      }).then(updatePage);
      }); 
     
     $(document).on("click", ".bearish",function(){
        event.preventDefault(); 
        var type=$(this).attr("id");
        console.log("ID de la moneda: "+type);  
         newsURL = newsURL+bearish+"&currencies="+type; 
      $.ajax({
        url:newsURL,
        method: "GET"
      }).then(updatePage);
      });    

function updatePage(cryptoData) {
     
      $("#crypto-stats-3").empty();
      
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

        $("#crypto-stats-3").append(card);
        var br=$("<br>");
        $("#crypto-stats-3").append(br);

      
      
      }


    }  

    $(document).keypress(function(e) {

        //if the pressed key is entered, start looking for the new currency, but first validate
        if(e.which == 13) {

            console.log("entra cuando hago enter");
            
            var makeCard=false;

            if($('#searchVal').val()!==""){
            var searchTerm=($('#searchVal').val()).charAt(0).toUpperCase() + (($('#searchVal').val()).slice(1)).toLowerCase();
            $('#searchVal').val("");
            console.log(searchTerm);
            }

            database.ref().once('value', function(snapshot) {
                if (snapshot.hasChild(searchTerm)) {
               
                 database.ref().child(searchTerm).once('value',function(snapshot){

                    if(snapshot.val().rank>12){
                    var card=$("<div>");
                    card.addClass("card");
                    var cardBody=$("<div>");
                    cardBody.addClass("card-body");

                    var title=$("<h5>").text(snapshot.val().cryptoName);
                    title.addClass("card-title");
                    var subtitle=$("<h6>").text(snapshot.val().symbol);
                    subtitle.addClass("card-subtitle mb-2 text-muted");

                    var rank=$("<p>").text("Rank: "+snapshot.val().rank);
                    rank.addClass("card-text");
                    rank.append("<br>");
                    rank.append("Price (USD): $"+snapshot.val().price);
                    rank.append("<br>");

                    var hour=$("<p>");
                    if (snapshot.val().percentageHour<=0){
                        hour.append("(1h): "+snapshot.val().percentageHour+"%");
                        hour.append("<br>");
                        hour.addClass("rojo");
                    }
                    else{
                        hour.append("(1h): "+snapshot.val().percentageHour+"%");
                        hour.append("<br>");
                        hour.addClass("verde");
                    }
                    var day=$("<p>");
                    if (snapshot.val().percentageDay<=0){
                        day.append("(24h): "+snapshot.val().percentageDay+"%");
                        day.append("<br>");
                        day.addClass("rojo");
                    }
                    else{
                        day.append("(24h): "+snapshot.val().percentageDay+"%");
                        day.append("<br>");
                        day.addClass("verde");
                    }
                    var week=$("<p>");
                    if (snapshot.val().percentageWeek<=0){
                        week.append("(Week): "+snapshot.val().percentageWeek+"%");
                        week.append("<br>");
                        week.addClass("rojo");
                    }
                    else{
                        week.append("(Week): "+snapshot.val().percentageWeek+"%");
                        week.append("<br>");
                        week.addClass("verde");
                    }

                
                
                    var link=$("<button>").text("News");
                    link.attr("id",snapshot.val().symbol);
                    link.addClass("none");
                    link.addClass("row btn btn-primary");
                
                    var link2=$("<button>").text("Bullish");
                    link2.attr("id",snapshot.val().symbol);
                    link2.addClass("bullish");
                    link2.addClass("row btn btn-warning");

                    var link3=$("<button>").text("Bearish");        
                    link3.attr("id",snapshot.val().symbol);
                    link3.addClass("bearish");
                    link3.addClass("row btn btn-success");

                    card.addClass("col-lg-3 col-md-6 col-sm-12 charlie");
                    
                    card.append(title).append(subtitle).append(rank).append(hour).append(day).append(week).append(link).append(link2).append(link3);
                    card.append("<br>");

                    $("#cards").append(card);}

                    else{

                        alert("the information about this cryptocurrency is already being displayed");
                    }

                 });
                  
                }

                else{

                    alert("the cryptocurrency does not exist");
                }
               });

        }


    });


});
