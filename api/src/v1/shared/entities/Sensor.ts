import { Entity, Column, OneToMany, OneToOne } from 'typeorm';import { BaseEntity } from './BaseEntity';import { Hub } from './Hub';import { TemperatureReading } from './TemperatureReading';import {Field, ObjectType} from 'type-graphql';import {Log} from "./Log";@ObjectType()@Entity({ name: 'sensors' })export class Sensor extends BaseEntity{    @Field()    @Column({ nullable: false, default: '' })    name!: string;    @Field()    @Column({ nullable: false, default: '' })    serial!: string;    @Field()    @Column({ name: 'curent_temp', type: 'mediumint', nullable: false, default: 0 })    currentTemp!: number;    @Field()    @Column({ name: 'signal_strength', type: 'mediumint', nullable: false, default: 0 })    signalStrength!: number;    @Field()    @Column({ name: 'battery_status', type: 'mediumint', nullable: false, default: 0 })    batteryStatus!: number;    @Field()    @Column({ name: 'is_connected', type: 'tinyint', nullable: false, default: 0 })    isConnected!: number;    @Field()    @Column()    description!: string;    @Field()    @Column()    type!: string;    @Field()    @Column({ name: 'last_seen', nullable: true })    lastSeen!: string;    @OneToOne(() => Hub, hub => hub.sensor, { cascade: ['insert', 'update'] })    hub!: Hub;    @OneToMany(() => TemperatureReading, temperatureReading => temperatureReading.sensor)    temperatureReadings!: TemperatureReading[];    @OneToMany(() => Log, log => log.sensor)    logs!: Log[];}