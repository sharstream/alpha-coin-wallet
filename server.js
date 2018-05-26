"use strict";

let account = require('./controllers/accounts-helper');

let transaction = require('./controllers/transactions-helper');

const bodyParser = require('body-parser');

const express = require('express');

const session = require('express-session');

// Globals

const PORT = process.env.PORT || '3000';

const SECRET = process.env.SECRET;

let app = express();

let db = require('./models');

// App settings
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.set('view engine', 'pug');

//App middleware
app.use(express.static('public'));

// App routes
var api_account_routes = require('./routes/api-accounts-routes.js')(app);

var api_transaction_routes = require('./routes/api-transactions-routes.js');

app.use(session({
    cookie: {httpOnly: true},
    secret: SECRET
}));

app.use(api_transaction_routes.oidc.router);

//Cron jobs
// run node.js process to update the cache of
// transaction data once per hour (in milliseconds)
setInterval(() => {
    transaction.updateTransactions(err => {
        if (err) {
            console.error(err);
        }
    })
}, 1000 * 60 * 60);

//Server management
api_transaction_routes.oidc.on('ready', () => {
    db.sequelize.sync({
        force: true
    }).then(function() {
        app.listen(PORT, () => {
            console.log(`Listening web service on port ` + PORT);
        });
    });
});

api_transaction_routes.oidc.on('error', err => {
    console.error(err);
});