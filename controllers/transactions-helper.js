// Helpers
const async = require('async');

// Startup jobs

module.exports = function(client, transactions){

    let account;
    // update transaction helpers

    function updateTransactions(cb) {
        transactions = [];
        let pagination = null;

        async.doWhilst(
            function (callback) {
                account.getTransactions(pagination, (err, txns, page) => {
                    if (err) {
                        return callback(err);
                    }

                    pagination = page.next_uri ? page : false;

                    txns.forEach(txn => {
                        if (txn.type === "request") {
                            transactions.push(txn);
                        }
                    });

                    callback();
                });
            },
            function () {
                return pagination ? true : false;
            },
            function (err) {
                if (err) {
                    return cb(err);
                }

                cb(null, transactions);
            }
        );
    }

    //Cron jobs
    // run node.js process to update the cache of
    // transaction data once per hour (in milliseconds)
    setInterval(() => {
        updateTransactions(err => {
            if (err) {
                console.error(err);
            }
        })
    }, 1000 * 60 * 60);

    client.getAccounts({}, (err, accounts) => {
        if (err) {
            console.error(err);
        }

        accounts.forEach(acct => {
            if (acct.primary) {
                account = acct;
                console.log("Found primary account: " + account.name + ". Current balance: " + account.balance.amount + " " + account.currency + ".");

                console.log("Downloading initial list of transactions.");
                updateTransactions(err => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        });
    });

    return transactions;

};