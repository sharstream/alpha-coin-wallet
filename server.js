"use strict";

const dotenv = require('dotenv')

const result = dotenv.config();

if (result.error) {
    throw result.error;
}

const Client = require('coinbase').Client;

const async = require('async');

const bodyParser = require('body-parser');

const express = require('express');

const session = require('express-session');

const ExpressOIDC = require('@okta/oidc-middleware').ExpressOIDC;

// Globals

const OKTA_ISSUER_URI = process.env.OKTA_ISSUER_URI;

const OKTA_CLIENT_ID = process.env.OKTA_CLIENT_ID;

const OKTA_CLIENT_SECRET = process.env.OKTA_CLIENT_SECRET;

const REDIRECT_URI = process.env.REDIRECT_URI;

const PORT = process.env.PORT || '3000';

const SECRET = process.env.SECRET;

const client = new Client({
    apiKey: process.env.COINBASE_APIKEY_ID,
    apiSecret: process.env.COINBASE_APIKEY_SECRET
});

let account;

let transactions;

let app = express();

// App settings
app.set('view engine', 'pug');

//App middleware
app.use('/static', express.static('static'));

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
    routes: { callback: {defaultRedirect: '/dashboard'} },
    scope: 'openid profile'
});

app.use(oidc.router);

app.listen(PORT, () => {
    console.log(`Listening web service on port ` + PORT);
});