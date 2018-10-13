"use strict";
(function ($) {
  var MAX_SPARKLINE_POINTS = 30;
  var quote, change;
  var quotes = [];

  $(document).ready(function () {
    var $loader = $('#cppg-loader');
    var $game = $('#cppg-game');
    var $wins = $('#cppg-wins');
    var $losses = $('#cppg-losses');
    var $chart = $('#cppg-chart');
    var $quote = $('#cppg-quote');
    var $asset = $('#cppg-asset');
    var $duration = $('#cppg-duration');
    var $positiveResult = $('#cppg-positive-result');
    var $negativeResult = $('#cppg-negative-result');
    var $gameResult = $('.cppg-result');
    var $buttonsContainer = $('#cppg-buttons-container');
    var $actionButtons = $('.cppg-action');
    var $question = $('#cppg-question');
    var $prediction = $('#cppg-prediction');
    var initialized = false;
    var stats = Cookies.getJSON('cppg_stats') || {wins: 0, losses: 0};
    $wins.text(stats.wins);
    $losses.text(stats.losses);

    $asset.chosen({width: '9.5rem'});
    $duration.chosen({width: '8rem'});

    //initialize quotes data feed
    var dataFeed = new DataFeed({
      url: 'wss://streamer.cryptocompare.com',
      asset: $asset.val(),
      onTick: function (data) {
        var receivedQuote = typeof data.PRICE != 'undefined' ? parseFloat(data.PRICE) : 0;
        if (receivedQuote > 0) {
          change = typeof quote != 'undefined' ? receivedQuote - quote : 0;
          quote = receivedQuote;
          if (change > 0) {
            $quote.addClass('cppg-quote-up');
          } else if (change < 0) {
            $quote.addClass('cppg-quote-down');
          }
          setTimeout(function () {
            $quote.removeClass('cppg-quote-up cppg-quote-down');
          }, 500);
          // remove quote from the beginning of the quotes history array
          if (quotes.length > MAX_SPARKLINE_POINTS) {
            quotes.shift();
          }
          quotes.push(quote);
          $quote.text(quote.format(2));
          // diaplay / update chart
          $chart.sparkline(
            quotes, {
              type: 'line',
              lineWidth: $chart.data('line-width'),
              lineColor: $chart.data('line-color'),
              fillColor: $chart.data('fill-color'),
              spotColor: $chart.data('spot-color'),
              minSpotColor: $chart.data('min-spot-color'),
              maxSpotColor: $chart.data('max-spot-color'),
              spotRadius: $chart.data('spot-radius'),
              highlightLineColor: $chart.data('highlight-line-color'),
              tooltipChartTitle: '<span class="cppg-tooltip">'+$asset.find(':selected').text()+'</span>',
              width: $chart.width(),
              height: $chart.height(),
              tooltipFormat: '<span class="cppg-tooltip"><span style="color: {{color}}">&#9679;</span> <b>{{y}}</b></span></span>'
            }
          );
          // display game (on page load) when at least 1 tick is arrived
          if (!initialized && quotes.length > 0) {
            initialized = true;
            $loader.hide();
            $game.show();
          }
        }
      }
    });

    // asset is changed by user
    $asset.on('change', function () {
      quotes = [];
      dataFeed.changeAsset($asset.val());
    });

    // game is started by user
    $actionButtons.on('click', function () {
      $question.hide();
      $gameResult.hide();
      $buttonsContainer.css({opacity: 0});
      var $button = $(this);
      var direction = parseInt($button.data('direction'), 10);
      var directionText = $button.data('text');
      var predictionText = $prediction.data('text');
      var startQuote = quote;
      var asset = $asset.find(':selected').text();
      $prediction.html(predictionText.format(asset, directionText, startQuote.format(2), $duration.val())).show();
      var game = new Game({
        direction: direction,
        duration: $duration.val(),
        startQuote: quote,
        onSecondPassed: function (secondsLeft) {
          $prediction.html(predictionText.format(asset, directionText, startQuote.format(2), secondsLeft));
        },
        onFinish: function (gameWon) {
          if (gameWon) {
            stats.wins++;
            $positiveResult.html($positiveResult.data('text').format(quote.format(2))).show();
            $wins.text(parseInt(stats.wins, 10));
          } else {
            stats.losses++;
            $negativeResult.html($negativeResult.data('text').format(quote.format(2))).show();
            $losses.text(parseInt(stats.losses, 10));
          }
          Cookies.set('cppg_stats', stats, { expires: 365 });
          setTimeout(function () {
            $prediction.hide();
            $question.show();
            $gameResult.hide();
            $buttonsContainer.css({opacity: 1});
          }, 5000);
        }
      })
    });
  });

  /**
   * Prediction game
   * @param options
   * @constructor
   */
  function Game(options) {
    log('New game', options);
    var duration = options.duration || 5;
    var direction = options.direction || 1;
    var startQuote = options.startQuote || NaN;
    var secondsLeft = duration;
    var secondInterval = setInterval(function () {
      if (typeof options.onSecondPassed == 'function') {
        secondsLeft--;
        options.onSecondPassed(secondsLeft);
      }
    }, 1000);
    // calculate game result and return TRUE if user wins and FALSE if user loses
    setTimeout(function () {
      clearInterval(secondInterval);
      if (typeof options.onFinish == 'function' && !isNaN(startQuote)) {
        var result = direction * (quote - startQuote) > 0 ? true : false;
        log('Game finished, direction: {0}, startQuote: {1}, current: {2}, duration: {3}, result: {4}'.format(direction, startQuote, quote, duration, result));
        options.onFinish(result);
      }
    }, duration * 1000);
  }

  /**
   * SOCKET.IO datafeed
   * @param options
   * @returns {{changeAsset: changeAsset}}
   * @constructor
   */
  function DataFeed(options) {
    var FIELDS = {
      'TYPE'            : 0x0       // hex for binary 0, it is a special case of fields that are always there
      , 'MARKET'          : 0x0       // hex for binary 0, it is a special case of fields that are always there
      , 'FROMSYMBOL'      : 0x0       // hex for binary 0, it is a special case of fields that are always there
      , 'TOSYMBOL'        : 0x0       // hex for binary 0, it is a special case of fields that are always there
      , 'FLAGS'           : 0x0       // hex for binary 0, it is a special case of fields that are always there
      , 'PRICE'           : 0x1       // hex for binary 1
      , 'BID'             : 0x2       // hex for binary 10
      , 'OFFER'           : 0x4       // hex for binary 100
      , 'LASTUPDATE'      : 0x8       // hex for binary 1000
      , 'AVG'             : 0x10      // hex for binary 10000
      , 'LASTVOLUME'      : 0x20      // hex for binary 100000
      , 'LASTVOLUMETO'    : 0x40      // hex for binary 1000000
      , 'LASTTRADEID'     : 0x80      // hex for binary 10000000
      , 'VOLUMEHOUR'      : 0x100     // hex for binary 100000000
      , 'VOLUMEHOURTO'    : 0x200     // hex for binary 1000000000
      , 'VOLUME24HOUR'    : 0x400     // hex for binary 10000000000
      , 'VOLUME24HOURTO'  : 0x800     // hex for binary 100000000000
      , 'OPENHOUR'        : 0x1000    // hex for binary 1000000000000
      , 'HIGHHOUR'        : 0x2000    // hex for binary 10000000000000
      , 'LOWHOUR'         : 0x4000    // hex for binary 100000000000000
      , 'OPEN24HOUR'      : 0x8000    // hex for binary 1000000000000000
      , 'HIGH24HOUR'      : 0x10000   // hex for binary 10000000000000000
      , 'LOW24HOUR'       : 0x20000   // hex for binary 100000000000000000
      , 'LASTMARKET'      : 0x40000   // hex for binary 1000000000000000000, this is a special case and will only appear on CCCAGG messages
    };
    var SUBSCRIPTION_STRING = '5~CCCAGG~{0}~USD';
    var url = options.url || '';
    var asset = options.asset || '';
    var socket;

    if (url && asset) {
      connect();
    }

    /**
     * Establish SOCKET connection
     */
    function connect() {
      log('Making SOCKET connection to ' + url);
      socket = io.connect(url);
      socket.on('m',          onMessage);
      socket.on('connect',    onConnect);
      socket.on('disconnect', onDisconnect);
      subscribe(asset);
    }

    function subscribe(asset) {
      log('Subscribing to ' + asset);
      socket.emit('SubAdd', {
        subs: [SUBSCRIPTION_STRING.format(asset)]
      });
    }

    function unsubscribe(asset) {
      log('unsubscribing from ' + asset);
      socket.emit('SubRemove', {
        subs: [SUBSCRIPTION_STRING.format(asset)]
      });
    }

    /**
     * SOCKET connection is established
     */
    function onConnect() {
      log('SOCKET connection OPEN');
    }

    /**
     * SOCKET message is received
     * @param message
     */
    function onMessage(message) {
      var data = parseMessage(message);
      log('SOCKET message', data);
      if (typeof options.onTick == 'function') {
        /* BEGIN MAIN PART */
        options.onTick(data);
      }
    }

    /**
     * SOCKET connection is closed
     */
    function onDisconnect() {
      log('SOCKET connection CLOSED');
      connect();
    }

    /**
     * Change current asset
     * @param newAsset
     */
    function changeAsset(newAsset) {
      log('change asset to ' + newAsset);
      if (socket.connected) {
        unsubscribe(asset);
        asset = newAsset;
        subscribe(asset);
      } else {
        asset = newAsset;
        connect();
      }
    }

    function parseMessage(value) {
      var valuesArray = value.split("~");
      var valuesArrayLenght = valuesArray.length;
      var mask = valuesArray[valuesArrayLenght - 1];
      var maskInt = parseInt(mask, 16);
      var unpackedCurrent = {};
      var currentField = 0;
      for (var property in FIELDS) {
        if (FIELDS[property] === 0) {
          unpackedCurrent[property] = valuesArray[currentField];
          currentField++;
        } else if (maskInt & FIELDS[property]) {
          //i know this is a hack, for cccagg, future code please don't hate me:(, i did this to avoid
          //subscribing to trades as well in order to show the last market
          if (property === 'LASTMARKET') {
            unpackedCurrent[property] = valuesArray[currentField];
          } else {
            unpackedCurrent[property] = parseFloat(valuesArray[currentField]);
          }
          currentField++;
        }
      }
      return unpackedCurrent;
    }

    return {
      changeAsset: changeAsset
    }
  }

  function log() {
    if ((typeof cppgGlobals != 'undefined' && cppgGlobals.debug) || (typeof DEBUG != 'undefined' && DEBUG)) {
      console.log(arguments);
    }
  }

  /**
   * Format number
   */
  Number.prototype.format = function() {
    var decimalDigits = typeof arguments[0] != 'undefined' ? arguments[0] : 2;
    return this.toFixed(decimalDigits);
  }

  /**
   * Format string (like sprintf)
   */
  String.prototype.format = function() {
    //var args = Array.prototype.slice.call(arguments, 1);
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
  };
})(jQuery);