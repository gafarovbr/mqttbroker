const { addLog } = require('./db');
const { log } = require('./utils');

function Log(type, message) {
    log(type, message);
    addLog(type, message);
}

module.exports = {
    Log,
};
