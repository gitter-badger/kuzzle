var
  should = require('should'),
  Dsl = require('root-require')('lib/api/dsl/index');

require('should-promised');

describe('Test: dsl.addCurriedFunction', function () {

  var
    dsl,
    roomId = 'roomId',
    collection = 'user',
    fakeFilter = {
      fakeFilter: {
        city: ['NYC', 'London']
      }
    },
    filter = {
      terms: {
        city: ['NYC', 'London']
      }
    };

  before(function () {
    dsl = new Dsl();
  });


  it('should return an error when the filter is undefined', function () {
    return should(dsl.addCurriedFunction(roomId, collection, undefined)).be.rejected();
  });

  it('should return an error when the filter doesn\'t exist', function () {
    return should(dsl.addCurriedFunction(roomId, collection, fakeFilter)).be.rejected();
  });

  it('should return an error when the filter is empty', function () {
    return should(dsl.addCurriedFunction(roomId, collection, {})).be.rejected();
  });

  it('should resolve a promise when the filter exists', function () {
    return should(dsl.addCurriedFunction(roomId, collection, filter)).not.be.rejected();
  });

});
