const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('indexP');
});

router.get('/login', (req, res) => {
    res.render('loginP', {
        layout: 'login',
    });
});

router.get('/dashboard', (req, res) => {
    res.render('dashboardP');
});

module.exports = router;