$(document).ready(function () {
    src="https://www.gstatic.com/firebasejs/5.5.3/firebase.js"
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
            var price=results[i].quotes.USD.price;
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
                momentAdded: firebase.database.ServerValue.TIMESTAMP //the moment added will be used to comapre when the information was uploaded and to decide if we need to call the API again or not
            });   
       }
      });
      
      database.ref().on("child_added", function (childSnapshot) {
        
      if(childSnapshot.val().rank<=30){

        var card=$("<div>");
        card.addClass("col-lg-4 col-md-6 col-sm-12");
        var cardTop=$("<div>");
        cardTop.addClass("card crypto-card-3 pull-up");
        var cardContent=$("<div>");
        cardContent.addClass("card-content");
        var cardBody=$("<div>");
        cardBody.addClass("card-body pb-0");
        var cardRow =$("<div>");
        cardRow.addClass("row");
        var cardcol =$("<div>");
        cardcol.addClass("col-2");
        var cardcol2 =$("<div>");
        cardcol2.addClass("col-5 pl-2");
        var cardcol5 =$("<div>");
        cardcol5.addClass("col-5 text-right");
        var colIcon=$("<h1>");
        var incolIcon=$("<i>");
        var classIcon ="cc " + childSnapshot.val().symbol+" font-large-2";
        incolIcon.addClass(classIcon);
        var title=$("<h6>").text(childSnapshot.val().cryptoName);
        title.addClass("text-muted");
        var coin=$("<h4>").text(childSnapshot.val().symbol);
        var rank=$("<h4>").text("Rank: "+childSnapshot.val().rank);
        var price=$("<h4>").text("$"+(childSnapshot.val().price).toString().substring(0,(childSnapshot.val().price).toString().indexOf('.')+3));  
        var day=$("<p>");
        if (childSnapshot.val().percentageDay<=0){
            day.append(childSnapshot.val().percentageDay+"%");
            day.append("<br>");
            day.addClass("danger");
            day.addClass("la la-arrow-down");
        }
        else{
            day.append(childSnapshot.val().percentageDay+"%");
            day.append("<br>");
            day.addClass("success darken-4");
            day.addClass("la la-arrow-up");
        }
        cardcol5.append(price).append(day);
        cardcol2.append(rank).append(coin).append(title);
        colIcon.append(incolIcon);
        cardcol.append(colIcon);
        cardRow.append(cardcol).append(cardcol2).append(cardcol5);
        cardBody.append(cardRow);
        cardContent.append(cardBody);
        cardTop.append(cardContent);
        card.append(cardTop);
        card.append("<br>");
        card.attr("id", title);
        $("#crypto-stats-3").append(card);}
       
    

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

});
