// Helpers
const dotenv = require('dotenv')

const result = dotenv.config();

if (result.error) {
    throw result.error;
}

const Client = require('coinbase').Client;

var transaction = require('./transactions-helper');

// Startup jobs

const client = new Client({
    apiKey: process.env.COINBASE_APIKEY_ID,
    apiSecret: process.env.COINBASE_APIKEY_SECRET
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

                console.log('Doanloading inital list of transactions.');

                transaction.updateTransactions(err => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        });
    });
}

module.exports = getAccounts;