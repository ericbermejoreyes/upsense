import {Entity, Column, ManyToOne, OneToMany} from 'typeorm';
import BaseEntity from './base';
import Company from './company';
import Zone from './zone';
const serializer = require('jsonapi-serializer').Serializer;

@Entity({ name: 'branches' })
export default class Branch extends BaseEntity
{
    @Column({ type: 'text', nullable: false, default: null })
    name!: string;

    @ManyToOne(() => Company, company => company.branches, { cascade: ['insert', 'update'] })
    company!: Company;

    @OneToMany(() => Zone, zone => zone.branch, { cascade: true })
    zones!: Zone[];

    /**
     * Create this function to serialize the data to show in the api response
     */
    serialize()
    {
        return new serializer('branches', {
            id: 'uuid',
            keyForAttribute: 'camelCase',
            attributes: ['name', 'createdAt', 'updatedAt']
        }).serialize(this);
    }
}
