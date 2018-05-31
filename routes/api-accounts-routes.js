// api accounts routes
require('../controllers/wallet-helper');
module.exports = function (app, account) {

    app.get('/', (req, res) => {
        res.render('index');
    });

    app.get('/account', (req, res) => {
        res.render('index', { account: account });
    });

    app.post('/accounts/:id/addresses/', function (req, res) {
        res.redirect('https://api.coinbase.com/v2/accounts/:account_id/addresses');
        res.render('index');
    });

    app.get('/login/coinbase', function (req, res) {
        res.redirect('https://www.coinbase.com/oauth/authorize?response_type=code&redirect_uri=https://localhost:3000/auth/coinbase/callback&client_id=' + client_id + '&scope=wallet:user:read,wallet:accounts:read');
        res.render('index');
    });

    app.get('/auth/coinbase/callback', function (req, res) {
        var data = {
            client_id: process.env.COINBASE_CLIENT_ID,
            client_secret: process.env.COINBASE_APIKEY_SECRET,
            grant_type: 'authorization_code',
            code: req.query.code,
            redirect_uri: 'https://localhost:3000/profile'
        }

        request.post(
            'https://api.coinbase.com/oauth/token', data,
            function (error, response, body) {
                console.log(body)
                res.send(body)
            }
        );
    });

    app.get('/profile', function (req, res) {
        res.send('index');
    });
};