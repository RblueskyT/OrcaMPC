const path = require('path');
const express = require('express');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require("connect-mongo")(session);
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const connectDB = require('./config/db');

// Passport config
require('./config/passport_local')(passport);

// Config and Database Connecting
dotenv.config({ path: './config/config.env' });
connectDB();

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// Express Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
};

// View Engine: Handlebars
app.engine('.hbs', exphbs({defaultLayout: 'index', extname: '.hbs'}));
app.set('view engine', '.hbs');

// Static folder
app.use(express.static(path.join(__dirname, 'assets')));


// Flash message
app.use(flash());
app.use(function (req, res, next){
    res.locals.flash_success_message = req.flash('flash_success_message');
    res.locals.flash_error_message = req.flash('flash_error_message');
    next();
});

//Routes
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/users', userRouter);


// Server Connecting
const PORT = process.env.PORT || 8080;

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);