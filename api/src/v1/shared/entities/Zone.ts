import {Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn} from 'typeorm';import { BaseEntity } from './BaseEntity';import { User } from './User';import { Hub } from './Hub';import { NotificationSetting } from './NotificationSetting';import {Company} from "./Company";@Entity({ name: 'zones' })export class Zone extends BaseEntity{    @Column({ type: 'text', nullable: false, default: '' })    name!: string;    @ManyToMany(() => User, user => user.zones, { cascade: ['insert', 'update' ]})    @JoinTable({        name: 'user_zones',        joinColumn: {            name: 'zone',            referencedColumnName: 'id'        },        inverseJoinColumn: {            name: 'user',            referencedColumnName: 'id'        }    })    users!: User[];    @ManyToOne(() => Company, company => company.zones, { onDelete: 'CASCADE', cascade: ['insert', 'update']})    @JoinColumn({name: 'company_id'})    company!: Company;    @OneToMany(() => Hub, hub => hub.zone)    hubs!: Hub[];    @OneToMany(() => NotificationSetting, notificationSetting => notificationSetting.zone)    notificationSettings!: NotificationSetting[];    serialize()    {        return {            id: this.id,            name: this.name,            updatedAt: this.updatedAt,            createdAt: this.createdAt        };    }}