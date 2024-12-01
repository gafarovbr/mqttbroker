const aedes = require('aedes')();
const auth = require('aedes-auth')();

// конфигурация для аутентификации
const users = {
    user1: 'password1',
    user2: 'password2',
    user3: 'password3',
};

// конфигурация прав доступа на топики
const acl = {
    user1: {
        publish: ['topic1'],
        subscribe: ['topic2'],
    },
    user2: {
        publish: ['topic2'],
        subscribe: ['topic1'],
    },
    user3: {
        publish: ['topic1', 'topic2'],
        subscribe: ['topic1', 'topic2'],
    },
};

// настройка аутентификации и прав доступа
aedes.authenticate = auth.authenticate({
    authenticate: (client, username, password, callback) => {
        const isValid = users[username] === password.toString();
        callback(null, isValid, { username });
    },
    authorizePublish: (client, packet, callback) => {
        const topic = packet.topic;
        const username = client.username;
        const allowed = acl[username].publish.includes(topic);
        callback(null, allowed);
    },
    authorizeSubscribe: (client, subscription, callback) => {
        const topic = subscription.topic;
        const username = client.username;
        const allowed = acl[username].subscribe.includes(topic);
        callback(null, allowed);
    },
});

// запуск сервера
const server = require('net').createServer(aedes.handle);
server.listen(1883, function () {
    console.log('MQTT server listening on port 1883');
});

// npm install aedes-auth --save