require('dotenv').config();
let express = require('express');
let favicon = require('serve-favicon');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let MongoStore = require('connect-mongo');
let account = require('./routes/account-controller');
let index = require('./routes/index');
let loan = require('./routes/loan-controller');
let transaction = require('./routes/transaction-controller');
let auth = require('./routes/auth-controller');
let cors=require("cors");
let app = express();



(async() => {
    let sessConnStr = "mongodb+srv://naamaholzer:0584322277@cluster0.xsp95.mongodb.net/blockchain-bank?retryWrites=true&w=majority";
    process.on('SIGINT', async() => {
        process.exit(0);
    });
    app.use(cors({
        origin:'http://localhost:3000', 
        credentials:true,            //access-control-allow-credentials:true
        optionSuccessStatus:200})) // Use this after the variable declaration
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    let secret = 'blockchain bank secret ';
    app.use(session({
        name: 'users.sid',
        secret: secret,
        resave: false,
        saveUninitialized: false,
        rolling: true,
        store: MongoStore.create({ mongoUrl: sessConnStr }),
        cookie: { maxAge: 900000, httpOnly: true, sameSite: true }
    }));
    app.use(cookieParser(secret));
    app.use('/account', account);
    app.use('/', index);
    app.use('/loan', loan);
    app.use('/transaction', transaction);
    app.use('/auth', auth);
    app.use(function(req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    app.use(function(err, req, res, next) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        res.status(err.status || 500).send(err.message);
    });
})()
.catch(err => {
    console.log(`Failure: ${err}`);
    process.exit(0);
});

module.exports = app;