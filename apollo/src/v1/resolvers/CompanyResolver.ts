import { Resolver, Query, Mutation, Args, Arg, Ctx } from 'type-graphql';
import {getRepository, Repository} from 'typeorm';
import { Company } from '../entities/Company';
import { QueryArgs } from '../resolverArgs/QueryArgs';
import { CompanyDataInput } from '../resolverInputs/CompanyDataInput';
import { Context } from '../objects/Context';

@Resolver()
export class CompanyResolver
{
    private repo: Repository<Company>;
    constructor()
    {
        this.repo = getRepository(Company);
    }

    @Query(() => [Company])
    async companies(
        @Args() {id, page, pageOffset, search}: QueryArgs,
        @Ctx() ctx: Context
    ) {
        let companies = null;

        if (!!id) {
            companies = await this.repo.findByIds([id]);
        } else {
            companies = await this.repo.find();
        }

        return companies;
    }

    @Mutation(() => Company)
    async addCompany(@Arg('data') data: CompanyDataInput) {
        let company = new Company();

        company.name = data.name;

        await this.repo.save(company);

        return company;
    }
}