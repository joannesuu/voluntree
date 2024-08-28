/* eslint-disable no-console */
function isAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.status(401).send('You have not been authenticated. Please log in. ');
    }
}

function isAdmin(req, res, next) {
    if (req.session.userRole === 'ADMIN') {
        next();
    } else {
        res.status(403).send('Access denied. Only users with admin permissions can access this page.');
    }
}
module.exports = { isAuthenticated, isAdmin };