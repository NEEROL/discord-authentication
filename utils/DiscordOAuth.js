const axios = require('axios');

class DiscordOAuth2 {
    #api_version;
    #request;

    constructor({ api_version, client_id, client_secret, redirect_uri }) {
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.redirect_uri = redirect_uri;

        this.#api_version = 'v9' || api_version;

        this.#request = axios.create({
            baseURL: `https://discord.com/api/${this.#api_version}/`,
            headers: {
                'User-Agent': 'DiscordOAuth2',
            },
        });
    }

    #encodeParams(params) {
        return Object.entries(params)
            .reduce((str, [key, value]) => {
                if (value) str += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
                return str;
            }, '')
            .substr(1);
    }

    generateAuthUrl(options) {
        const obj = {
            client_id: options.client_id || this.client_id,
            redirect_uri: options.redirect_uri || this.redirect_uri,
            response_type: options.response_type || 'code',
            scope: options.scope.join(' '),
            state: options.state || undefined,
        };
        const encodedObj = this.#encodeParams(obj);

        return `https://discord.com/api/oauth2/authorize?${encodedObj}`;
    }

    getAccessToken(opts) {
        let obj = {
            client_id: this.client_id,
            client_secret: this.client_secret,
            grant_type: opts.grant_type,
            code: undefined,
            refresh_token: undefined,
            redirect_uri: this.redirect_uri,
            scope: opts.scope.join(' '),
        };

        switch (opts.grant_type) {
            case 'refresh_token':
                obj.refresh_token = opts.refresh_token;
                break;
            case 'authorization_code':
                obj.code = opts.code;
                break;
            default:
                throw new Error('Invalid grant_type provided, it must be either authorization_code or refresh_token');
        }

        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await this.#request.post('oauth2/token', this.#encodeParams(obj), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });
                resolve(data);
            } catch (e) {
                reject(e);
            }
        });
    }

    getUser(access_token) {
        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await this.#request.get('users/@me', {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });
                resolve(data);
            } catch (e) {
                reject(e);
            }
        });
    }

    getUserGuilds(access_token) {
        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await this.#request.get('users/@me/guilds', {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });
                resolve(data);
            } catch (e) {
                reject(e);
            }
        });
    }

    getUserConnections(access_token) {
        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await this.#request.get('users/@me/connections', {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });
                resolve(data);
            } catch (e) {
                reject(e);
            }
        });
    }
}

module.exports = DiscordOAuth2;
