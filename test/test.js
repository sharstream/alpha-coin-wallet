'use strict';

require('mocha');
var assert = require('assert');
var alphaCoinWallet = require('../routes/api-accounts-routes');
var alphaCoinInvoice = require('../routes/api-transactions-routes');
var account = require('../controllers/accounts-helper');
var wallet = require('../controllers/transactions-helper');

describe('Accounts', function() {
  it('should export a function', function() {
    assert.equal(typeof account.getAccounts, 'function');
  });

  it('should export an wallet', function() {
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
    assert.equal(typeof wallet.getTransactions, 'function');
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

describe('Accounts list', function() {
  it('should have 1+ account count after saving', function() {
    var accounts = account.getAccounts();

    account.createAccount({
      'name': 'New Wallet'
    });

    accounts.push(account);

    accounts.length.should.equal(accounts.getAccounts().length + 1);
  });

});

describe('Transactions list', function () {
  it('should have 1+ transaction count after saving', function () {
    var transactions = wallet.updateTransactions();

    var newTransaction;

    wallet.createInvoice({
      'To': 'New Wallet'
    });

    transactions.push(newTransaction);

    transactions.length.should.equal(transactions.updateTransactions().length + 1);
  });

});

//compare each type of transactions.