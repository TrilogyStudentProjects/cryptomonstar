$(document).ready(function () {

    var controlUrl ="https://cors-anywhere.herokuapp.com/https://cryptocontrol.io/api/v1/public/";
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
