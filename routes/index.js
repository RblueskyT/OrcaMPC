const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index/indexP');
});

router.get('/register', (req, res) => {
    res.render('index/registerP', {
        layout: 'register_login',
    });
});

router.get('/login', (req, res) => {
    res.render('index/loginP', {
        layout: 'register_login',
    });
});

router.post('/register', async (req, res) => {
    try{
        await User.create(req.body);
        res.redirect('/login');

    }catch{
        console.error(err);
    }
});

router.post('/login', (req, res) => {

});

router.get('/dashboard', (req, res) => {
    res.render('dashboardP');
});

module.exports = router;