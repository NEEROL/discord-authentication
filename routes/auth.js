const { Router } = require('express');
const { login, callback, getInfo, logout } = require('../controllers/auth');
const isAuthorized = require('../middlewares/isAuthorized');

const router = Router();

router.get('/login', login);
router.get('/callback', callback);
router.get('/@me', isAuthorized, getInfo);
router.get('/logout', isAuthorized, logout);

module.exports = router;
