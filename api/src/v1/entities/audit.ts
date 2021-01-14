import {Entity, Column, ManyToOne} from 'typeorm';
import BaseEntity from './base';
import Admin from './admin';
const serializer = require('jsonapi-serializer').Serializer;

@Entity({ name: 'audits' })
export default class Audit extends BaseEntity
{
    @Column({ name: 'operation_type', default: '', nullable: false })
    operationType!: string;

    @Column({ name: 'operation_info', default: '', nullable: false })
    operationInfo!: string;

    @ManyToOne(() => Admin, admin => admin.audits, { cascade: ['insert', 'update'] })
    admin!: Admin;
}
