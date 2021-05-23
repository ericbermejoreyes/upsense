import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';import { BaseEntity } from './BaseEntity';import { Hub } from './Hub';import { SensorReading } from './SensorReading';import {Field, Int, ObjectType} from 'type-graphql';import {Log} from "./Log";@ObjectType()@Entity({ name: 'sensors' })export class Sensor extends BaseEntity{    @Field()    @Column({ nullable: false, default: '' })    name!: string;    @Field()    @Column({ nullable: false, unique: true })    serial!: string;    @Field()    @Column({ name: 'current_temp', type: 'double', nullable: false, default: 0 })    currentTemp!: number;    @Field()    @Column({ name: 'battery_status', type: 'double', nullable: true, default: null })    batteryStatus!: number;    @Field()    @Column({ name: 'max_temp', type: 'double', nullable: true, default: null })    maxTemp!: number;    @Field()    @Column({ name: 'min_temp', type: 'double', nullable: true, default: null })    minTemp!: number;    @Field()    @Column({ name: 'is_connected', type: 'tinyint', nullable: false, default: 0 })    isConnected!: number;    @Field()    @Column({ default: '' })    description!: string;    @Field()    @Column({ default: '' })    type!: string;    @Field(() => Int)    @Column({ type: 'bigint', name: 'last_seen', default: null })    lastSeen!: number;    @ManyToOne(() => Hub, hub => hub.sensors, { cascade: ['insert', 'update'] })    hub!: Hub;    @OneToMany(() => SensorReading, sensorReading => sensorReading.sensor, { cascade: ['insert', 'update'], onDelete: 'SET NULL' })    sensorReadings!: SensorReading[];    @OneToMany(() => Log, log => log.sensor, { cascade: ['insert', 'update'], onDelete: 'SET NULL' })    logs!: Log[];    serialize()    {        let serialized: any = {            id: this.id,            name: this.name,            serial: this.serial,            currentTemp: this.currentTemp,            batteryStatus: this.batteryStatus,            isConnected: this.isConnected,            lastSeen: this.lastSeen,            minTemp: this.minTemp,            maxTemp: this.maxTemp,            createdAt: this.createdAt,            updatedAt: this.updatedAt        }        if (this.hub) {            serialized.hub = this.hub.serialize();        }        return serialized;    }}