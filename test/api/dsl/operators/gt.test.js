var
  should = require('should'),
  operators = require('root-require')('lib/api/dsl/operators');

describe('Test gt operator', function () {

  var document = {
    age: 10
  };

  it('should return false when the document field value is lower', function () {
    var result = operators.gt('age', 15, document);
    should(result).be.exactly(false);
  });

  it('should return true when the document field value is greater', function () {
    var result = operators.gt('age', 5, document);
    should(result).be.exactly(true);
  });

  it('should return false on equality', function () {
    var result = operators.gt('age', 10, document);
    should(result).be.exactly(false);
  });

});