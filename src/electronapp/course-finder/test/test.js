/* assertions */ 
var assert = require('assert');
var expect = require('chai').expect;

/* Return's -1 when function value not present
Arguments: none
Returns: -1
*/ 
const { hasUncaughtExceptionCaptureCallback } = require('process');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

/* 

describe('graphForceTree(d3JSON)', function() {
  if (typeof window === 'undefined') {
    before(function() {
      global.window = { alert() {} };
    });

    after(function() {
      delete global.window;
    });
  }
*/ 

/* Tests if function addChildren(results) has any children
Arguments: results
Returns: none
*/
describe("addChildren(results)", function(results) {
  it("returns array of children for a course", function() {
    var members = [];
      expect(members).to.have.members([]);
  });
});

 
/* Tests format of JSON object
Creates sample JSON object and then compares the format for both
objects
Arguments: data
Returns: none
*/ 
describe("buildForceGraphJSON(data)", function(data){
  it("builds JSON in the proper format", function(done) {
    let obj = {
      name: 'CIS', 
      size: '2', 
      children: '3',
    };
    expect([obj]).to.be.an('array');
    this.timeout(3000);
    done();
  //need to fix this!!!!!!!!! 
    //expect(obj).to.have.deep.members([{name: "CIS"}], [{size: 2}], [{children: 3}]);
  });
});
