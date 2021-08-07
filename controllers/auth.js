const { DiscordOAuth } = require('../instances');

const scope = ['identify'];

const login = (req, res) => {
    const url = DiscordOAuth.generateAuthUrl({ scope });
    res.redirect(url);
};

const callback = async (req, res) => {
    if (req.session.token) res.status(403).json({ status: 'error', message: 'Access denied' });

    if (req.query.error || req.query.error_description) return res.status(401).json({ status: 'error', message: error_description });
    if (!req.query.code) return res.status(401).json({ status: 'error', message: 'Missing query' });

    try {
        const token = await DiscordOAuth.getAccessToken({
            grant_type: 'authorization_code',
            code: req.query.code,
            scope,
        });

        req.session.token = token;

        res.status(200).json({ status: 'success', message: 'Authorization success', ...token });
    } catch (e) {
        res.status(400).json({ status: 'error', message: 'DiscordAPI error' });
    }
};

const getInfo = async (req, res) => {
    try {
        const user = await DiscordOAuth.getUser(req.session.token.access_token);
        res.status(200).json({ status: 'success', message: 'User info received', ...user });
    } catch (e) {
        res.status(400).json({ status: 'error', message: 'DiscordAPI error' });
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ status: 'error', message: 'Logout failed' });
        res.status(200).json({ status: 'success', message: 'Logout success' });
    });
};

module.exports = {
    login,
    callback,
    getInfo,
    logout,
};
