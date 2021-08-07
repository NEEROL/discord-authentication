const DiscordOAuth2 = require('./utils/DiscordOAuth');

const DiscordOAuth = new DiscordOAuth2({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI,
});

module.exports = {
    DiscordOAuth,
};
