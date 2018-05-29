// api accounts routes

module.exports = function (app) {

    app.get('/', (req, res) => {
        res.render('index');
    });

    app.get('/account', (req, res) => {
        res.render('account', { account: account });
    });
};