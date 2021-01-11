const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

module.exports = {
    MQTT_PORT: process.env.MQTT_PORT,
    MQTT_HOST: process.env.MQTT_HOST,
    MQTT_PROTOCOL: process.env.MQTT_PROTOCOL,
    MQTT_USERNAME: process.env.MQTT_USERNAME,
    MQTT_PASSWORD: process.env.MQTT_PASSWORD,
    INFLUX_TOKEN: process.env.INFLUX_TOKEN,
    INFLUX_ORG: process.env.INFLUX_ORG,
    INFLUX_BUCKET: process.env.INFLUX_BUCKET,
    INFLUX_PROTOCOL: process.env.INFLUX_PROTOCOL,
    INFLUX_PORT: process.env.INFLUX_PORT,
    INFLUX_HOST: process.env.INFLUX_HOST,
};