import { Entity, Column, ManyToOne } from 'typeorm';import { BaseEntity } from './BaseEntity';import { User } from './User';@Entity({ name: 'audits' })export class Audit extends BaseEntity{    @Column({ name: 'operation_type', default: '', nullable: false })    operationType!: string;    @Column({ name: 'operation_info', default: '', nullable: false })    operationInfo!: string;    @ManyToOne(() => User, user => user.audits, { cascade: ['insert', 'update'] })    user!: User;}