import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {Hub} from "../../shared/entities/Hub";
import {paginationConfig} from "../../../config";

export class HubRepository extends BaseRepository
{
    private searchableFields: string[] = [
        'name',
        'serial',
        'lastSeen',
    ];
    async getList(options: QueryOptions = {}): Promise<Hub[]> {
        let parameters: any = {};
        let whereStatements: any = [];

        const offset = options.page ? paginationConfig.limit * (options.page - 1) : 0;

        const query = await this
            .createQueryBuilder('h')
            .select([
                'h.id',
                'h.name',
                'h.serial',
                'h.lastSeen',
                'h.isConnected',
                'h.createdAt',
                'h.updatedAt'
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

            if (options.relations.indexOf('sensors') > -1) {
                query
                    .leftJoinAndSelect('h.sensors', 's');
            }

            if (options.relations.indexOf('zone') > -1) {
                query
                    .leftJoinAndSelect('h.zone', 'z');
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

    async update(hub: Hub, data: Partial<Hub>): Promise<boolean> {
        const relationQueryBuilder = this.repository
            .createQueryBuilder()
            .relation(Hub, 'zone');

        //@ts-ignore
        if (data.zone.id && data.zone.createdAt) {
            //@ts-ignore
            await relationQueryBuilder.of(hub).set(data.zone);
        } else {
            await relationQueryBuilder.of(hub).set(null);
        }

        return true;
    }

    async findOneById(id: number): Promise<Hub | undefined>
    {
        return await this.repository.findOne({where: { id }});
    }

    async findOneBy(options: any, relations: any = null): Promise<Hub | undefined> {
        options = {where: options};

        if (relations !== null) {
            options.relations = relations;
        }
        return await this.repository.findOne(options);
    }

    async save(hub: Hub) {
        await this.repository.save(hub);
    }
}
