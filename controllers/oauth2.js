// OAuth2 Connect
module.exports = function (app, passport, CoinbaseStrategy) {
    // Passport session setup.
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session.  Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing.  However, since this example does not
    //   have a database of user records, the complete Coinbase profile is serialized
    //   and deserialized.
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    //Authentication
    passport.use(new CoinbaseStrategy({
            clientID: process.env.COINBASE_CLIENT_ID,
            clientSecret: process.env.COINBASE_APIKEY_SECRET,
            callbackURL: process.env.REDIRECT_URI,
            scopes: ["user"]
        },
        function (accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {

                // To keep the example simple, the user's Coinbase profile is returned to
                // represent the logged-in user.  In a typical application, you would want
                // to associate the Coinbase account with a user record in your database,
                // and return that user instead.
                return done(null, profile);
            });
        }
    ));

    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());
};