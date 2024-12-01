const chalk = require('chalk');

/**
 * Преобразовать дату в нужный формат
 *
 * Можно передать значение даты в формате YYYY-MM-DD hh:mm:ss, UTC, а также в миллисекундах
 *
 * @example format = 'DD.MM.YYYY hh:mm:ss'; // default
 *
 * Format.getFormat('2021-06-15', 'DD.MM.YYYY'); // 15.06.2021
 * Format.getFormat(new Date(), 'DD.MM.YYYY'); // 15.06.2021
 * Format.getFormat(1623751680766, 'DD.MM'); // 15.06
 */
function getDate(_date, format) {
    let out = format ? format : 'DD.MM.YYYY hh:mm:ss';

    const date = new Date(_date);
    const day = zero(date.getDate());
    const month = zero(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = zero(date.getHours());
    const minutes = zero(date.getMinutes());
    const seconds = zero(date.getSeconds());

    out = out.replace('YYYY', year);
    out = out.replace('YY', year);
    out = out.replace('MM', month);
    out = out.replace('DD', day);
    out = out.replace('hh', hours);
    out = out.replace('mm', minutes);
    out = out.replace('ss', seconds);
    return out;
}

function zero(str) {
    return String(str).padStart(2, '0');
}

function parseTopic(topic) {
    const a = topic.split('/');
    return {
        clientId: a[0],
        type: a[1],
        uuid: a[2],
        topic: a.splice(3).join('/'),
    };
}

function parsePayload(payload) {
    let message = {};
    try {
        message = JSON.parse(payload.toString());
    } catch (e) {
        log('error', payload.toString());
    }
    return { message };
}

function log(type, message) {
    const dateTime = getDate(Date.now());
    console.log(chalk.magentaBright(dateTime), getType(type).padEnd(5, ' '), message);
}

function getType(type) {
    switch (type) {
        case 'info':
            return `[${chalk.blue(type.toUpperCase())}]`;
        case 'warn':
            return `[${chalk.yellow(type.toUpperCase())}]`;
        case 'error':
            return `[${chalk.red(type.toUpperCase())}]`;
        case 'sys':
            return `[${chalk.greenBright(type.toUpperCase())}]`;
        case 'cmd':
            return `[${chalk.cyanBright(type.toUpperCase())}]`;
        case 'state':
            return `[${chalk.cyanBright(type.toUpperCase())}]`;
        case 'sensr':
            return `[${chalk.cyanBright(type.toUpperCase())}]`;
    }
    return type;
}

module.exports = { getDate, log, parseTopic, parsePayload };
