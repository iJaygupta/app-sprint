

exports.socialAuth = function (app, controller, error, auth, middleware) {

    const passport = require('passport')
        , FacebookStrategy = require('passport-facebook').Strategy
        , cookieParser = require('cookie-parser')
        , session = require('express-session')


    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });


    // Use the FacebookStrategy within Passport.

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_API_KEY,
        clientSecret: process.env.FACEBOOK_API_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        assReqToCallback: true,
        profileFields: ['id', 'emails', 'name']
    },
        function (accessToken, refreshToken, profile, callback) {
            process.nextTick(async function () {
                try {
                    //Check whether the User exists or not using profile.id
                    profile = await controller.checkUserExistAndSignUp(profile._json, callback);
                    return callback(null, profile[0]);
                } catch (error) {
                    return callback(true, error);
                }


            });
        }
    ));


    app.set('views', global.appDir + '../../common/');
    app.set('view engine', 'ejs');
    app.use(cookieParser());
    app.use(session({ secret: 'keyboard cat', key: 'sid' }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.route('/account').get(ensureAuthenticated, function (req, res) {

        res.render('account', { user: req.user });
    });

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/user/facebook-login', failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/');
        });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.route("/user/facebook-login").get(function (request, response) {
        try {
            response.render('template', { user: request.user });
        }
        catch (err) {
            error(err, response)
        }
    })


    function ensureAuthenticated(req, res, next) {

        if (req.isAuthenticated()) { return next(); }
        res.redirect('/login')
    }

}