// api transactions routes

let transactions;
module.exports = function (app, client, oidc) {
    transactions = require('../controllers/transactions-helper')(client, transactions)

    app.get('/', (req, res) => {
        res.render('index');
    });

    app.get('/dashboard', oidc.ensureAuthenticated(), (req, res) => {
        res.render('dashboard', {
            transactions: transactions
        });
    });

    app.post('/dashboard', oidc.ensureAuthenticated(), (req, res) => {
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

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
};