const isAuthorized = (req, res, next) => {
    if (req.session.token) return next();
    res.status(403).json({ status: 'error', message: 'Unauthorized' });
};

module.exports = isAuthorized;
