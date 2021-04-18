import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {Zone} from "../../shared/entities/Zone";
import {paginationConfig} from "../../../config";

export class ZoneRepository extends BaseRepository
{
    private searchableFields: string[] = ['name'];

    /**
     *
     * @param options
     */
    async getList(options: QueryOptions = {}): Promise<Zone[]> {
        let parameters: any = {};
        let whereStatements: any = [];

        const offset = options.page ? paginationConfig.limit * (options.page - 1) : 0;

        const query = await this
            .createQueryBuilder('z')
            .select([
                'z.id',
                'z.name',
                'z.updatedAt',
                'z.createdAt'
            ])
            .offset(offset)
            .limit(paginationConfig.limit);

        // create filters if provided
        if (options.filters !== undefined) {
            for (const [field, value] of Object.entries(options.filters)) {
                whereStatements.push(`z.${field} = :${field}`);
                parameters[field] = value;
            }
        }

        // add sort and
        if (options.sort !== undefined) {
            for (const [field, value] of Object.entries(options.sort)) {
                query.addOrderBy(`z.${field}`, value)
            }
        }

        // create search statement if find is provided
        if (options.find !== undefined) {
            parameters.find = `%${options.find}%`;
            let searchStatement = [];

            for (const field of this.searchableFields) {
                searchStatement.push(`z.${field} LIKE :find`);
            }

            whereStatements.push(`(${searchStatement.join(' OR ')})`);
        }

        do {
            if (options.relations === undefined) {
                break;
            }

            if (options.relations.indexOf('users') > -1) {
                query
                    .leftJoinAndSelect('z.users', 'u');
            }

            break;
        } while (true);

        if (whereStatements.length > 0) {
            query
                .where(whereStatements.join(' AND '))
                .setParameters(parameters);
        }

        return await query.getMany();
    }

    /**
     *
     * @param data
     */
    async create(data: any): Promise<Zone>
    {
        const repository = await this.repository;
        let zone: Zone = new Zone();
        zone.name = data.name;
        zone.company = data.company;
        await repository.save(zone);
        return zone;
    }

    /**
     *
     * @param company
     * @param data
     */
    async update(zone: Zone, data: Partial<Zone>): Promise<boolean>
    {
        zone.name = data.name || zone.name;

        await this.repository.save(zone);

        return true;
    }

    /**
     *
     * @param id
     */
    async findOneById(id: number): Promise<Zone | undefined>
    {
        return await this.em.getRepository(Zone).findOne({where: { id }});
    }

    async findOneBy(options: any, relations: any = null): Promise<Zone | undefined>
    {
        options = {where: options};
        if (relations !== null) {
            options.relations = relations;
        }
        return await this.em.getRepository(Zone).findOne(options);
    }

    /**
     *
     * @param zone
     */
    async delete(zone: Zone): Promise<boolean>
    {
        await this.repository.remove(zone);
        return true;
    }
}
