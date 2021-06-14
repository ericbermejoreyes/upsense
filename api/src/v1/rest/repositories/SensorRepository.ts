import {BaseRepository, QueryOptions} from "../../shared/repositories/BaseRepository";
import {Sensor} from "../../shared/entities/Sensor";
import {paginationConfig} from "../../../config";
import {Hub} from "../../shared/entities/Hub";

export class SensorRepository extends BaseRepository
{
    private searchableFields: string[] = [
        'name',
        'serial',
        'lastSeen',
    ];

    async getList(options: QueryOptions = {}): Promise<Sensor[]>
    {
        let parameters: any = {};
        let whereStatements: any = [];

        const offset = options.page ? paginationConfig.limit * (options.page - 1) : 0;

        const query = await this
            .createQueryBuilder('s')
            .select([
                's.id',
                's.name',
                's.serial',
                's.currentTemp',
                's.batteryStatus',
                's.isConnected',
                's.lastSeen',
                's.minTemp',
                's.maxTemp',
                's.createdAt',
                's.updatedAt'
            ])
            .offset(offset)
            .limit(paginationConfig.limit);

        // create filters if provided
        if (options.filters !== undefined) {
            for (const [field, value] of Object.entries(options.filters)) {
                if (field === 'hub') {
                    switch (value) {
                        case null: whereStatements.push('s.hub IS NULL'); break;
                        default:
                            whereStatements.push('s.hub = :hubId');
                            parameters.hubId = value;
                    }
                } else {
                    whereStatements.push(`s.${field} = :${field}`);
                    parameters[field] = value;
                }
            }
        }

        // add sort and
        if (options.sort !== undefined) {
            for (const [field, value] of Object.entries(options.sort)) {
                query.addOrderBy(`s.${field}`, value)
            }
        }

        // create search statement if find is provided
        if (options.find !== undefined) {
            parameters.find = `%${options.find}%`;
            let searchStatement = [];

            for (const field of this.searchableFields) {
                searchStatement.push(`s.${field} LIKE :find`);
            }

            whereStatements.push(`(${searchStatement.join(' OR ')})`);
        }

        do {
            if (options.relations === undefined) {
                break;
            }

            if (options.relations.indexOf('hub') > -1) {
                query
                    .leftJoinAndSelect('s.hub', 'h');
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

    async update(sensor: Sensor, data: Partial<Sensor>): Promise<boolean> {
        //@ts-ignore
        sensor.maxTemp = parseInt(data.maxTemp) || sensor.maxTemp;
        //@ts-ignore
        sensor.minTemp = parseInt(data.minTemp) || sensor.minTemp;

        if (data.hub) {
            sensor.hub = data.hub;
        }

        await this.repository.save(sensor);

        return true;
    }

    async create(data: Partial<Sensor>):Promise<Sensor> {
        let sensor: Sensor = new Sensor();

        sensor.name = data.name!;
        sensor.serial = data.serial!;
        sensor.maxTemp = data.maxTemp!;
        sensor.minTemp = data.minTemp!;

        if (data.hub) {
            sensor.hub = data.hub;
        }

        await this.repository.save(sensor);

        return sensor;
    }

    async findOneBy(options: any, relations: any = null): Promise<Sensor | undefined> {
        options = {where: options};
        if (relations !== null) {
            options.relations = relations;
        }
        return await this.repository.findOne(options);
    }

    async save(sensor: Sensor) {
        await this.repository.save(sensor);
    }
}
