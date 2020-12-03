const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const connectDB = require('./config/db');

// Config and Database Connecting
dotenv.config({ path: './config/config.env' });
connectDB();

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// Logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
};

// View Engine: Handlebars
app.engine('.hbs', exphbs({defaultLayout: 'index', extname: '.hbs'}));
app.set('view engine', '.hbs');

// Static folder
app.use(express.static(path.join(__dirname, 'assets')));

//Routes
const indexRouter = require('./routes/index');

app.use('/', indexRouter);


// Server Connecting
const PORT = process.env.PORT || 8080;

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);