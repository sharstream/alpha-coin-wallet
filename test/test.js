'use strict';

require('mocha');

var chai = require('chai'),
  expect = chai.expect,
  should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../server');

var assert = require('assert');
var api_account_routes = require('../routes/api-accounts-routes');
var api_transactions_routes = require('../routes/api-transactions-routes');
var wallet = require('../controllers/transactions-helper');
var coinbase = require('coinbase');
var Client = coinbase.Client;

// moch data
var TEST_BASE_URI = 'http://mockapi.coinbase.com/v2/';
var accounts = [
  {
    'name': 'new wallet 1',
    'balance': {
      'amount': '0.07',
      'currency': 'BTC'
    }
  },
  { //gets deleted
    'name': 'new wallet 2',
    'balance': {
      'amount': "2.08",
      'currency': "USD"
    }
  }
];

describe('account methods', function() {

  var client = new Client({
    'apiKey': process.env.COINBASE_APIKEY_ID,
    'apiSecret': process.env.COINBASE_APIKEY_SECRET,
    'baseApiUri': TEST_BASE_URI
  });

  client.createAccount({
    'name': accounts[0]['name'],
    'primary': true
  });

  var btcAccount = accounts[0];
  var usdAccount1 = accounts[1];

  it('should setPrimary', () => {
    btcAccount.setPrimary(function(err, result) {
      assert.equal(err, null, err);
      assert(result);
    });
  });

  chai.use(chaiHttp);

  describe('/GET dashboard', () => {
    it('it should GET all the transactions', done => {
      chai.request(server)
        .get('/dashboard')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('arrays');
          res.body.length.should.be.eql(0);
         done();
        });
    });
  });

  describe('/POST dashboard', () => {
    it('it should not POST a transaction without pages field', done => {
      let transaction = {
        to: 'davedevelopmentusa@gmail.com',
        description: 'georgia powewr bill',
        amount: 1.00
      }
      chai.request(server)
        .post('/dashboard')
        .send(transaction)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('pages');
          res.body.errors.pages.should.have.property('description').eql(required);
         done();
        });
    });
  });

});