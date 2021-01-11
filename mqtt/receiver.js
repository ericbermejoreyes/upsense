const mqtt = require('mqtt');
const {MQTT_PORT, MQTT_HOST, MQTT_PROTOCOL, MQTT_USERNAME, MQTT_PASSWORD} = require('./config');

const CONNECT_OPTIONS = {
    port: MQTT_PORT,
    host: MQTT_HOST,
    protocol: MQTT_PROTOCOL,
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    rejectUnauthorized: false,
};

class Receiver {
    client = null;
    topic = null;
    onMessage = (topic, message) => {};

    constructor(topic) {
        this.topic = topic;
    }

    connect(connectionCallback = () => {}) {
        this.client = mqtt.connect(CONNECT_OPTIONS);

        this.client.on('connect', () => {
            console.log('Receiver connection to the MQTT broker: OK')
            // subscribe to a topic
            this.client.subscribe(this.topic);

            connectionCallback();

            // receive a message and do something with it
            this.client.on('message', this.onMessage);
        });

        this.client.on('error', (err) => {
            console.log('An error occurred. ' + err);
        });

        return this;
    }

    disconnect(cb = () => {})
    {
        this.client.end();
        cb();
        return this;
    }
}

module.exports = Receiver;
