var
  should = require('should'),
  operators = require('root-require')('lib/api/dsl/operators');

describe('Test geoBoundingBox operator', function () {

  var document = {
    'location.lat': 43.607466,
    'location.lon': 3.912785
  };

  it('should return true when the location in document is inside the box', function () {
    var
      box = {
        left: 43.629533,
        top: 3.840730,
        right: 43.595354,
        bottom: 3.934457
      },
      result = operators.geoBoundingBox('location', box, document);

    should(result).be.exactly(true);
  });

  it('should return false when the location in document is outside the box', function () {
    var
      box = {
        left: 43.613855,
        top: 3.872044,
        right: 43.606180,
        bottom: 3.880928
      },
      result = operators.geoBoundingBox('location', box, document);

    should(result).be.exactly(false);
  });

  // according to ES, when a location is exactly on the corner of the box, the document must be returned
  it('should return true when the location in document is exactly on one corner of the box', function () {
    var
      box = {
        left: 43.629533,
        top: 3.840730,
        right: 43.607466,
        bottom: 3.912785
      },
      result = operators.geoBoundingBox('location', box, document);

    should(result).be.exactly(true);
  });

});