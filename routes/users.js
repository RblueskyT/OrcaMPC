const express = require('express');
const session = require('express-session');
const { ensureAuthenticated } = require('../config/login_auth');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('../login');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('users/dashboardP', {
        username: req.user.username,
    });
});

router.get('/logout', (req, res) =>{    
    req.logout();
    req.flash('flash_success_message', 'You logged out sucessfully');
    res.redirect('../login');
});

module.exports = router;