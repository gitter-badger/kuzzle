var
  socket = require('socket.io'),
  async = require('async'),
  q = require('q'),
  _ = require('lodash'),
  WriteController = require('./writeController'),
  ReadController = require('./readController'),
  SubscribeController = require('./subscribeController'),
  BulkController = require('./bulkController'),
  AdminController = require('./adminController');

module.exports = function FunnelController (kuzzle) {

  this.write = null;
  this.subscribe = null;
  this.read = null;
  this.admin = null;
  this.bulk = null;

  this.init = function () {
    this.write = new WriteController(kuzzle);
    this.read = new ReadController(kuzzle);
    this.subscribe = new SubscribeController(kuzzle);
    this.bulk = new BulkController(kuzzle);
    this.admin = new AdminController(kuzzle);
  };

  /**
   * Execute in parallel all tests for check whether the object is well constructed
   * Then generate a requestId if not provided and execute the right controller/action
   *
   * @param {RequestObject} requestObject
   * @param {Object} connection
   * depending on who call execute (websocket or http)
   */
  this.execute = function (requestObject, connection) {
    var deferred = q.defer();

    requestObject.checkInformation()
      .then(function () {
        // Test if a controller and an action exist for the object
        if (!this[requestObject.controller] || !this[requestObject.controller][requestObject.action] ||
          typeof this[requestObject.controller][requestObject.action] !== 'function') {
          deferred.reject(new Error('No corresponding action ' + requestObject.action + ' in controller ' + requestObject.controller));
          return false;
        }

        return this[requestObject.controller][requestObject.action](requestObject, connection);
      }.bind(this))
      .then(function (responseObject) {
        deferred.resolve(responseObject);
      })
      .catch(function (error) {
        deferred.reject(error);
      });

    return deferred.promise;
  };

};
