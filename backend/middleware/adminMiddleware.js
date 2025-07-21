// middleware/adminMiddleware.js

module.exports = function(req, res, next) {
    // Assumes authMiddleware has already run and set req.user
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
};
