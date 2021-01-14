import {Entity, Column, ManyToOne, OneToOne} from 'typeorm';
import BaseEntity from './base';
import Zone from './zone';
import Sensor from './sensor';
const serializer = require('jsonapi-serializer').Serializer;

@Entity({ name: 'hubs' })
export default class Hub extends BaseEntity
{
    @Column({ nullable: false, default: null })
    serial!: string;

    @Column({ name: 'hw_version', nullable: false, default: null })
    hwVersion!: string

    @Column({ name: 'fw_version', nullable: false, default: null })
    fwVersion!: string

    @Column({ name: 'min_temp', nullable: true, default: null })
    minTemp!: number

    @Column({ name: 'max_temp', nullable: true, default: null })
    maxTemp!: number

    @Column({ nullable: true, default: null })
    temp!: number

    @Column()
    type!: string

    @Column()
    imei!: string

    @Column()
    status!: string

    @Column({
        type: 'bigint',
        nullable: false,
        name: 'last_seen'
    })
    lastSeen!: number;

    @ManyToOne(() => Zone, zone => zone.hubs)
    zone!: Zone;

    @OneToOne(() => Sensor, sensor => sensor.hub, { cascade: true })
    sensor!: Sensor;
}
