module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('flash_error_message', 'Please log in to view your dashboard')
        res.redirect('../login');
    }
}