var
  async = require('async'),
  q = require('q');

var myHooks = function () {
  /**
   *  API LOADING AND RELEASING
   *  Until cucumber.js supports BeforeAll and AfterAll tags, we have to open/close connections
   *  on each test case.
   *
   *  We could also load all the tested API at the beginning of each test case, using reentrant init() functions,
   *  and close them all at the very end using the AfterFeatures event.
   *  This method involves a cucumber.js hack, where we save a 'world' reference at the end of each test case so that
   *  we can use it when the AfterFeatures event is emitted.
   *
   *  Problem is, there is no guarantee that the world we saved still exists when this event is sent. In fact, the
   *  Cucumber.js documentation states that it should be destroyed at this point of time.
   *
   *  And we don't want to deal with destroyed worlds, this is all too messy. And dangerous.
   */
  this.Before('@usingREST', function (callback) {
    this.api = setAPI(this, 'REST');
    callback();
  });

  this.Before('@usingWebsocket', function (callback) {
    this.api = setAPI(this, 'Websocket');
    callback();
  });

  this.Before('@usingMQTT', function (callback) {
    this.api = setAPI(this, 'MQTT');
    callback();
  });

  this.Before('@usingAMQP', function (callback) {
    this.api = setAPI(this, 'AMQP');
    callback();
  });

  this.Before('@usingSTOMP', function (callback) {
    this.api = setAPI(this, 'STOMP');
    callback();
  });

  this.After(function (callback) {
    this.api.deleteByQuery({})
      .then(function () {
        this.api.disconnect();
        callback();
      }.bind(this))
      .catch(function (error) {
        callback(new Error(error));
      });
  });

  this.After('@removeSchema', function (callback) {
    this.api.deleteCollection()
      .then(function () {
        setTimeout(callback, 1000);
      })
      .catch(function (error) {
        callback(new Error(error));
      });
  });

  this.After('@unsubscribe', function (callback) {
    async.each(Object.keys(this.api.subscribedRooms), function (room, callbackAsync) {
      this.api.unsubscribe(room)
        .then(function () {
          callbackAsync();
        }.bind(this))
        .catch(function (error) {
          callbackAsync(error);
        });
    }.bind(this),
    function (error) {
      this.api.subscribedRooms = [];

      if (error) {
        callback(error);
      }

      callback();
    }.bind(this));
  });
};

module.exports = myHooks;

var setAPI = function (world, apiName) {
  var api = require('./api' + apiName);

  api.init(world);

  return api;
};
