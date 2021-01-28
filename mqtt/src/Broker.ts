import tls from 'tls';
import fs from 'fs';
import aedes, {Client} from 'aedes';
import { mqttConfig } from './config';

const OPTIONS = {
    key: fs.readFileSync('./certificates/cert.key'),
    cert: fs.readFileSync('./certificates/cert.pem'),
};

export class Broker
{
    aedes: any;
    server: any;

    constructor() {
        this.aedes = aedes();
        this.server = tls.createServer(OPTIONS, this.aedes.handle);
    }

    listen(cb: CallableFunction = () => {})
    {
        console.log(`Starting MQTT broker on port: ${mqttConfig.port}`);

        this.server.listen(mqttConfig.port, () => {
            console.log(`MQTT broker now running at ${mqttConfig.protocol}://${mqttConfig.host}:${mqttConfig.port}`);
            cb();
        });

        return this;
    }

    setupAuthentication()
    {
        this.aedes.authenticate = (client: Client, username: string, password: Buffer, cb: CallableFunction) => {
            if (username && username === 'root') {
                if (password && typeof password === 'object' && password.toString() === 'admin') {
                    cb(null, true);
                    console.log(`Client: ${client} authenticated successfully`);
                }
            } else {
                cb(false, false);
            }
        }

        return this;
    }
}
