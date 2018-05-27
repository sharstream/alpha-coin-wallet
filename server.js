"use strict";

// const account = require('./controllers/accounts-helper');
// const transaction = require('./controllers/transactions-helper');
const bodyParser = require('body-parser');
const path = require('path');
const pug = require('pug');
const express = require('express');
const session = require('express-session');
const async = require('async');
const dotenv = require('dotenv')
const result = dotenv.config();
const Client = require('coinbase').Client;
const ExpressOIDC = require('@okta/oidc-middleware').ExpressOIDC;

if (result.error) {
    throw result.error;
}

// Globals
const OKTA_ISSUER_URI = process.env.OKTA_ISSUER_URI;
const OKTA_CLIENT_ID = process.env.OKTA_CLIENT_ID;
const OKTA_CLIENT_SECRET = process.env.OKTA_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const PORT = process.env.PORT || '3000';
const SECRET = process.env.SECRET;
const client = new Client({
    apiKey: process.env.COINBASE_APIKEY_ID,
    apiSecret: process.env.COINBASE_APIKEY_SECRET,
    'version': '2018-03-31'
});

let account;
var transactions;

let app = express();
let db = require('./models');

// App settings
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'pug');

//App middleware
app.use("/public", express.static('public'));
app.use(express.static(path.join(__dirname, 'views')));

app.use(session({
    cookie: {httpOnly: true},
    secret: SECRET
}));

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

app.use(oidc.router);

// App routes
// require('./routes/api-accounts-routes.js')(app);
// require('./routes/api-transactions-routes.js')(app, client, oidc);

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/dashboard', oidc.ensureAuthenticated(), (req, res) => {
    res.render("dashboard", {
        transactions: transactions
    });
});

app.post('/dashboard', oidc.ensureAuthenticated(), bodyParser.urlencoded(), (req, res) => {
    account.requestMoney({
        to: req.body.email,
        amount: req.body.amount,
        currency: 'USD',
        description: req.body.description
    }, (err, txn) => {
        if (err) {
            console.error(err);
            return res.render('dashboard', {
                error: err
            });
        }

        updateTransactions((err, transactions) => {
            if (err) {
                console.error(err);
                return res.render('dashboard', {
                    error: err.message
                });
            }

            return res.render('dashboard', {
                transactions: transactions
            })
        });
    });
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Helpers
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

// Startup jobs
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

// Cron jobs
setInterval(() => {
    updateTransactions(err => {
        if (err) {
            console.error(err);
        }
    })
}, 1000 * 60 * 60);

//Server management
oidc.on('ready', () => {
    // db.sequelize.sync({
    //     force: true
    // }).then(function() {
        app.listen(PORT, () => {
            console.log(`Listening web service on port ` + PORT);
        });
    // });
});

oidc.on('error', err => {
    console.error(err);
});