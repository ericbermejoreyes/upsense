import {Column, Entity, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn} from "typeorm";
const {v4: uuidv4} = require('uuid');
const crypto = require('crypto');

/**
 * The Base Entity, extend this abstract class to define common fields
 */
export default abstract class Base
{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, nullable: false })
    uuid!: string;

    @Column({ type: 'bigint', nullable: false, name: 'created_at' })
    createdAt!: number;

    @Column({ type: 'bigint', nullable: false, name: 'updated_at' })
    updatedAt!: number;

    @BeforeInsert()
    setCreatedAt()
    {
        this.createdAt = Date.now();
        this.updatedAt = this.createdAt;
    }

    @BeforeInsert()
    assignUuid()
    {
        this.uuid = uuidv4();
    }

    @BeforeUpdate()
    setUpdatedAt()
    {
        this.updatedAt = Date.now();
    }
}
