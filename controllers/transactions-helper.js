// Helpers
const async = require('async');

let account = require('./accounts-helper');;

let transactions;

// update transaction helpers
var updateTransactions = function (cb) {
    transactions = [];
    let pagination = null;
    // a callback which is called after the test function has failed and repeated
    // execution of iteratee has stopped. callback will be passed an error and
    // any arguments passed to the final iteratee's callback. Invoked with (err, [results])
    async.doWhilst(
        function (callback) {
            account.getTransactions(pagination, (err, txns, page) => {
                if (err) {
                    return callback(err);
                }

                pagination = page.next_uri ? page : false;

                txns.forEach(txn => {
                    if (txn.type === 'request') {
                        transactions.push(txn);
                    }
                });

                callback();
            });
        },
        function () {
            return pagination ? true : false;
        },
        function(err){
            if (err) {
                return cb(err);
            }

            cb(null, transactions);
        });
};

module.exports = updateTransactions;