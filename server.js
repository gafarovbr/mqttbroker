const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);

const { parseTopic, parsePayload, log } = require('./src/utils');
const { Log } = require('./src/log');
const { addValueBySensor, updateConfigByClient, testConnect } = require('./src/db');

init();
const clientConfigResetMap = new Map();

async function init() {
    //await testConnect();

    const Port = 1883;

    server.listen(Port, function () {
        Log('info', `Aedes listening on port ${Port}`);
    });

    aedes.on('client', function (client) {
        Log('info', `Client connected ${client.id}`);
    });

    aedes.on('clientDisconnect', (client) => {
        Log('warn', `Client ${client.id} disconnected`);
    });

    aedes.on('publish', function (packet, client) {
        const { clientId, type, uuid, topic } = parseTopic(packet.topic);

        if (clientId === '$SYS') {
            // Действия при обработке системных топиков
            switch (uuid) {
                case 'heartbeat':
                    log('sys', `${uuid}`);
                    break;
                default:
                    Log('sys', `Received message ${uuid}`);
            }
        } else {
            // Действия при обработке пользовательских топиков
            const { message } = parsePayload(packet.payload);
            let clientConfig;
            switch (type) {
                case 'settings':
                    if (uuid == 'config') {
                        switch (topic) {
                            // При получении settings/main/config надо сохранить настройки в базу по клиенту
                            case 'reset':
                                Log('info', `Client ${client.id} reset config`);
                                clientConfigResetMap.set(client.id, { count: message.count, sensors: [] });
                                break;
                            case 'sensor':
                                clientConfig = clientConfigResetMap.get(client.id);
                                clientConfig.sensors.push(message);
                                Log('info', `Client ${client.id} append sensor in config`);
                                if (clientConfig.sensors.length === clientConfig.count) {
                                    Log('info', `Update config for Client ${client.id}`);
                                    //updateConfigByClient(
                                    //    client.id,
                                    //    JSON.stringify({
                                    //        clientId: client.id,
                                    //        sensors: clientConfig.sensors,
                                    //    }),
                                    //);
                                    clientConfigResetMap.delete(client.id);
                                }
                                break;
                        }
                    }
                    break;
                case 'commands':
                    Log('cmd', `Client ${client.id} received command ${message} to sensor ${uuid}`);
                    break;
                case 'status':
                    Log('state', `Client ${client.id} received status ${message} to sensor ${uuid}`);
                    break;
                case 'sensors':
                    Log('sensr', `Client ${client.id} received values ${message.value} by sensor ${uuid}`);
                    addValueBySensor(client.id, uuid, message.value);
                    break;
                default:
                    Log('info', `Client ${client.id} received message ${message} to topic ${topic || packet.topic}`);
            }
            // + Получается чтобы другой клиент узнал об датчиках ему надо сначала сходить в бд
            // + И тогда клиент на странице выбирает за какими датчиками следить ->
            // + сервер организует подписку по mqtt и канал с websocket в который кидает все необходимые значения
        }
    });
}

// Действия при обработке пользовательских топиков
// Подписка на топики, связанные с командами
/* aedes.subscribe(`commands/+/+`, (packet, client) => {

// Подписка на топики, связанные с изменением статусов
aedes.subscribe(`status/+/+`, (packet, client) => {

// Подписка на топики, связанные с изменением значений сенсоров
aedes.subscribe(`sensors/+/+`, (packet, client) => {
*/

/* @TODO Починить bluetuth
@TODO Разделить код на классы (устройства, MQTT wifi bluetuth )
@TODO Логика взаимодействия устройств */
