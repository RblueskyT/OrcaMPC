// Make sure that user functions can only be accessed by authenticated users
module.exports = {
    ensureAuthenticated: function (req, res, next) {

        if (req.isAuthenticated()) {
            return next();
        }

        req.flash('flash_error_message', 'Please log in to access to services');
        res.redirect('../login');
    }
}