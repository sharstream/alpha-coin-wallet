// api transactions routes

const ExpressOIDC = require('@okta/oidc-middleware').ExpressOIDC;

const bodyParser = require('body-parser');

const account = require('../controllers/accounts-helper');

const transaction = require('../controllers/transactions-helper');

// Globals

const OKTA_ISSUER_URI = process.env.OKTA_ISSUER_URI;

const OKTA_CLIENT_ID = process.env.OKTA_CLIENT_ID;

const OKTA_CLIENT_SECRET = process.env.OKTA_CLIENT_SECRET;

const REDIRECT_URI = process.env.REDIRECT_URI;

//Authentication
let oidc = new ExpressOIDC({
    issuer: OKTA_ISSUER_URI,
    client_id: OKTA_CLIENT_ID,
    client_secret: OKTA_CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    routes: {
        callback: {
            defaultRedirect: '/dashboard'
        }
    },
    scope: 'openid profile'
});

// App routes

module.exports = {
    app: function (app){
        app.get('/', (req, res) => {
            res.render('index');
        });

        app.get('/dashboard', oidc.ensureAuthenticated(), (req, res) => {
            res.render('dashboard', {transactions: transactions});
        });

        app.post('/dashboard', oidc.ensureAuthenticated(), bodyParser.urlencoded({extended: true}), (req, res) => {
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

                transaction.updateTransactions((err, transactions) => {
                    if (err) {
                        console.error(err);
                        return res.render('dashboard', { error: err.message});
                    }

                    return res.render('dashboard', { transactions: transactions });
                });
            });
        });

        app.get('/logout', (req, res) => {
            req.logout();
            res.redirect('/');
        });
    },
    oidc: oidc
};