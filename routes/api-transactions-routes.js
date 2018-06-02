// api transactions routes
var express = require('express');
var router = express.Router();
let transactions;
module.exports = function (client, oidc) {
    require('../controllers/wallet-helper')(client, transactions)

    router.get('/', (req, res) => {
        res.render('index');
    });

    router.get('/dashboard', oidc.ensureAuthenticated(), (req, res) => {
        res.render('dashboard', {
            transactions: transactions
        });
    });

    router.post('/dashboard', oidc.ensureAuthenticated(), (req, res) => {
        account.requestMoney({
            to: req.body.email,
            amount: req.body.amount,
            currency: 'USD',
            description: req.body.description
        }, (err, txn) => {
            if (err) {
                console.error(err);
                return res.render('dashboard', { error: err});
            }

            updateTransactions((err, transactions) => {
                if (err) {
                    console.error(err);
                    return res.render('dashboard', { error: err.message});
                }

                return res.render('dashboard', {
                    transactions: transactions
                });
            });
        });
    });

    router.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    router.delete('/dashboard', (req, res) => {

    });

    router.put('/dashboard', (req, res) => {

    });
};