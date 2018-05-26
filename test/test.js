'use strict';

require('mocha');
var assert = require('assert');
var alphaCoinWallet = require('./');

describe('alpha-coin-wallet', function() {
  it('should export a function', function() {
    assert.equal(typeof alphaCoinWallet, 'function');
  });

  it('should export an object', function() {
    assert(alphaCoinWallet);
    assert.equal(typeof alphaCoinWallet, 'object');
  });

  it('should throw an error when invalid args are passed', function() {
    assert.throws(function() {
      alphaCoinWallet();
    });
  });

});