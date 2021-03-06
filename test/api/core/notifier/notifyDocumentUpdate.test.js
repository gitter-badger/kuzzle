/**
 * The notifier core component can be directly invoked using the notify() function, but it also listens
 * to messages coming from workers.
 * And in particular, messages from the write worker(s), that need to be forwarded to the right listeners.
 *
 * This file tests the documents update notifications.
 */
var
  should = require('should'),
  captainsLog = require('captains-log'),
  rewire = require('rewire'),
  RequestObject = require('root-require')('lib/api/core/models/requestObject'),
  ResponseObject = require('root-require')('lib/api/core/models/responseObject'),
  params = require('rc')('kuzzle'),
  Kuzzle = require('root-require')('lib/api/Kuzzle'),
  Notifier = rewire('../../../../lib/api/core/notifier');

require('should-promised');

var mockupCacheService = {
  addId: undefined,
  removeId: undefined,
  room: undefined,

  init: function () {
    this.addId = this.removeId = this.room = undefined;
  },

  add: function (id, room) {
    if (room.length > 0) {
      this.addId = id;
      this.room = room;
    }
    return Promise.resolve({});
  },

  remove: function (id, room) {
    if (room.length > 0) {
      this.removeId = id;
    }
    return Promise.resolve({});
  },

  search: function (id) {
    if (id === 'removeme') {
      return Promise.resolve(['foobar']);
    }
    else {
      return Promise.resolve([]);
    }
  }
};

var mockupTestFilters = function (responseObject) {
  if (responseObject.data._id === 'errorme') {
    return Promise.reject(new Error('rejected'));
  }
  else if (responseObject.data._id === 'removeme') {
    return Promise.resolve([]);
  }
  else {
    return Promise.resolve(['foobar']);
  }
};

var mockupReadEngine = {
  get: function (requestObject) {
    return Promise.resolve(new ResponseObject(requestObject, {}));
  }
};

describe('Test: notifier.notifyDocumentUpdate', function () {
  var
    kuzzle,
    requestObject = new RequestObject({
      controller: 'write',
      action: 'update',
      requestId: 'foo',
      collection: 'bar',
      body: { foo: 'bar' }
    }),
    responseObject = new ResponseObject(requestObject, { _id: 'Sir Isaac Newton is the deadliest son-of-a-bitch in space' }),
    notified = 0;

  before(function (done) {
    kuzzle = new Kuzzle();
    kuzzle.log = new captainsLog({level: 'silent'});
    kuzzle.start(params, {dummy: true})
      .then(function () {
        kuzzle.services.list.notificationCache = mockupCacheService;
        kuzzle.services.list.readEngine = mockupReadEngine;
        kuzzle.dsl.testFilters = mockupTestFilters;
        kuzzle.notifier.notify = function (rooms) {
          if (rooms.length > 0) {
            notified++;
          }
        };
        done();
      });
  });

  it('should return a promise', function () {
    var result = (Notifier.__get__('notifyDocumentUpdate')).call(kuzzle, responseObject);

    should(result).be.a.Promise();
    return should(result).be.fulfilled();
  });

  it('should return a rejected promise if the document is not well-formed', function () {
    responseObject.data._id = 'errorme';

    return should((Notifier.__get__('notifyDocumentUpdate')).call(kuzzle, responseObject)).be.rejected();
  });

  it('should notify subscribers when an updated document entered their scope', function (done) {
    responseObject.data._id = 'addme';

    notified = 0;
    mockupCacheService.init();

    (Notifier.__get__('notifyDocumentUpdate')).call(kuzzle, responseObject)
      .then(function () {
        should(notified).be.exactly(1);
        should(mockupCacheService.addId).be.exactly(responseObject.data._id);
        should(mockupCacheService.room).be.an.Array();
        should(mockupCacheService.room[0]).be.exactly('foobar');
        should(mockupCacheService.removeId).be.undefined();
        done();
      })
      .catch (function (e) {
        done(e);
      });
  });

  it('should notify subscribers when an updated document left their scope', function (done) {
    responseObject.data._id = 'removeme';

    notified = 0;
    mockupCacheService.init();

    (Notifier.__get__('notifyDocumentUpdate')).call(kuzzle, responseObject)
      .then(function () {
        should(notified).be.exactly(1);
        should(mockupCacheService.addId).be.undefined();
        should(mockupCacheService.room).be.undefined();
        should(mockupCacheService.removeId).be.exactly(responseObject.data._id);
        done();
      })
      .catch (function (e) {
      done(e);
    });
  });
});
