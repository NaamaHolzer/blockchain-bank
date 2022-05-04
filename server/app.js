let express = require('express');
let favicon = require('serve-favicon');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let MongoStore = require('connect-mongo');
let account = require('./routes/accountcontroller');
let index = require('./routes/index');
let loan = require('./routes/loancontroller');
let transaction = require('./routes/transactioncontroller');
let user = require('./routes/usercontroller');
let app = express();

(async() => {
    let sessConnStr = "mongodb+srv://naamaholzer:0584322277@cluster0.xsp95.mongodb.net/blockchain-bank?retryWrites=true&w=majority";
    process.on('SIGINT', async() => {
        process.exit(0);
    });
    let secret = 'blockchain bank secret ';
    app.use(cookieParser(secret));
    app.use(session({
        name: 'users.sid',
        secret: secret,
        resave: false,
        saveUninitialized: false,
        rolling: true,
        store: MongoStore.create({ mongoUrl: sessConnStr }),
        cookie: { maxAge: 900000, httpOnly: true, sameSite: true }
    }));

    app.use('/account', account);
    app.use('/', index);
    app.use('/loan', loan);
    app.use('/transaction', transaction);
    app.use('/user', user);
    app.use(function(req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    app.use(function(err, req, res, next) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        res.status(err.status || 500);
        res.render('error');
    });
})()
.catch(err => {
    console.log(`Failure: ${err}`);
    process.exit(0);
});

module.exports = app;