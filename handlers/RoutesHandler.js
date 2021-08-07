const fs = require('fs/promises');
const path = require('path');

const RoutesHandler = (app) => {
    return new Promise(async (resolve, reject) => {
        try {
            const files = await fs.readdir(path.join(__dirname, '../routes'));

            for (const file of files) {
                const route = require(path.join(__dirname, '../routes', file));
                const routeName = file.split('.')[0];
                app.use(`/${routeName}`, route);
            }

            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = RoutesHandler;
