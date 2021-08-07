const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const RoutesHandler = require('./handlers/RoutesHandler');

const isDev = process.env.NODE_ENV === 'production';

(async () => {
    const app = express();

    app.use(
        cors({
            origin: process.env.ORIGIN,
            credentials: true,
        }),
    );
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: { secure: isDev },
        }),
    );
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    await RoutesHandler(app);

    app.get('/*', (req, res) => res.status(404).json({ status: 'error', message: 'Invalid query' }));

    const port = isDev ? process.env.PORT : 8080;
    app.listen(port, () => console.log(`Server is running at port ${port}`));
})();
