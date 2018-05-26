// Helpers
const dotenv = require('dotenv')

const result = dotenv.config();

if (result.error) {
    throw result.error;
}

const Client = require('coinbase').Client;

let transaction = require('./transactions-helper');

let account;
// Startup jobs

const client = new Client({
    apiKey: process.env.COINBASE_APIKEY_ID,
    apiSecret: process.env.COINBASE_APIKEY_SECRET,
    'version': '2018-03-31'
});

var getAccounts = function(){
    client.getAccounts({}, (err, accounts) => {
        if (err) {
            console.error(err);
        }

        accounts.forEach(acct => {
            if (acct.primary) {
                account = acct;
                console.log('Found primary account: ' + account.name +
                    +'. Current balance: ' + account.balance.amount +
                    +' ' + account.currency + '.');

                console.log('Downloading inital list of transactions.');

                transaction.updateTransactions(err => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        });
    });

    //create new wallet
    client.createAccount({'name': 'New Wallet'}, (err, acct) => {
        account = acct;
        console.log(acct.name + ': ' + acct.balance.amount + ' ' + acct.balance.currency);
    });
}

module.exports = getAccounts;