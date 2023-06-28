const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');
// const { log } = require('util');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
})

const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'fuckyouRanjit',
    db: 'newECM',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
    
}

const production = {
    name: 'production',
    asset_path: process.env.INTELLICAMPUS_ASSEST_PATH,
    session_cookie_key: process.env.INTELLICAMPUS_SESSION_COOKIE_KEY,
    db: process.env.INTELLICAMPUS_DB,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}


module.exports = production;

// module.exports = eval(process.env.INTELLICAMPUS_ENVIRONMENT == undefined ? development : eval(process.env.INTELLICAMPUS_ENVIRONMENT));