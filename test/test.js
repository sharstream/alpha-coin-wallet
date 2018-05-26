'use strict';

require('mocha');
var assert = require('assert');
var alphaCoinWallet = require('../routes/api-accounts-routes');
var alphaCoinInvoice = require('../routes/api-transactions-routes');

describe('Accounts', function() {
  it('should export a function', function() {
    assert.equal(typeof alphaCoinWallet, 'function');
  });

  it('should export an account', function() {
    assert(alphaCoinWallet);
    assert.equal(typeof alphaCoinWallet, 'object');
  });

  it('should throw an error when invalid args are passed', function() {
    assert.throws(function() {
      alphaCoinWallet();
    });
  });

});

describe('Transactions', function () {
  it('should export a function', function () {
    assert.equal(typeof alphaCoinInvoice, 'function');
  });

  it('should export an invoice', function () {
    assert(alphaCoinInvoice);
    assert.equal(typeof alphaCoinInvoice, 'object');
  });

  it('should throw an error when invalid args are passed', function () {
    assert.throws(function () {
      alphaCoinInvoice();
    });
  });

});