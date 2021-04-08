var assert = require('assert');
var { calculate_fullness } = require('../js/CodeFlower.js');
var Application = require('spectron').Application;


describe('CodeFlower.js', function() {
  describe('Calculate Fullness', function() {
    it('No Capacity', function() {
      var colour = calculate_fullness(0, 0);
      assert.equal(colour, "#bd0053");
    });
    it('100% Fullness', function() {
      var colour = calculate_fullness(0, 100);
      assert.equal(colour, "#bd0053");
    });
    it('90%+ Fullness', function() {
      var colour = calculate_fullness(5, 100);
      assert.equal(colour, "#f56418");
    });
    it('75%+ Fullness', function() {
      var colour = calculate_fullness(20, 100);
      assert.equal(colour, "#61b8c1");
    });
    it('50%+ Fullness', function() {
      var colour = calculate_fullness(40, 100);
      assert.equal(colour, "#61b8c1");
    });
    it('50%- Fullness', function() {
      var colour = calculate_fullness(99, 100);
      assert.equal(colour, "teal");
    });
  });

  describe('CodeFlower', function() {
    it('App can Start', async function() {
        var app = new Application({path: 'index.html'});
        var a = app.start().then(function () {
          // Check if the window is visible
          return app.browserWindow.isVisible()
        });
    });


    it('App can Stop', async function() {
      var app = new Application({path: '../index.html'});
      app.start().then(async function () {
        var stopped = app.stop();
        assert.equal(stopped, app);
        assert.equal(app.isRunning(), false);
      });
    });
  });
});