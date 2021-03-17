const connectDB = require('./config/db');
const dotenv = require('dotenv');
const express = require('express');
const exphbs = require('express-handlebars');
const favicon = require('serve-favicon');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require("connect-mongo")(session);

// Passport config - user authentications
require('./config/passport_local')(passport);

// Database config and connection
dotenv.config({ path: './config/config.env' });
connectDB();

// Express
const app = express();

// App icon loading
app.use(favicon(__dirname + '/assets/images/favicon.ico'));

// JIFF server config
var http = require('http').Server(app);
var JIFFServer = require('./jiff/lib/jiff-server');
var jiffServer = new JIFFServer(http, { logs: true });

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Express Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: (6 * 60 * 60 * 1000) },
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

// View Engine config: Handlebars helpers
const { formatDate, truncate, serialNumber, ifEquals, ifNEquals } = require('./config/hbs_helpers');

// View Engine: Handlebars
app.engine('.hbs', exphbs({
    helpers: {
        formatDate,
        truncate,
        serialNumber,
        ifEquals,
        ifNEquals
    }, defaultLayout: 'index', extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Static folder
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/dist', express.static(path.join(__dirname, 'jiff', 'dist')));
app.use('/lib', express.static(path.join(__dirname, 'jiff', 'lib')));

// Flash message setting
app.use(flash());
app.use(function (req, res, next) {
    res.locals.flash_success_message = req.flash('flash_success_message');
    res.locals.flash_error_message = req.flash('flash_error_message');
    next();
});

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const votingRouter = require('./routes/voting');
const surveysRouter = require('./routes/surveys');
const communityRouter = require('./routes/community');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/users/voting', votingRouter);
app.use('/users/surveys', surveysRouter);
app.use('/community', communityRouter);

// Server Connecting
const PORT = process.env.PORT || 8080;

http.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);