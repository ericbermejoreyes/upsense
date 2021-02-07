import {Resolver, Query, Mutation, Authorized, Arg, Args} from 'type-graphql';
import { Admin } from '../entities/Admin';
import {AdminFilterInput, CreateAdminInput, UpdateAdminInput} from '../resolverInputs/AdminDataInput';
import {AdminRepository} from "../repositories/AdminRepository";
import {QueryArgs} from "../resolverArgs/QueryArgs";
import {SortType} from "../../components/types/SortOrderTypes";
import {AdminResponse} from "../response/AdminResponse";
import {SingleAdminResponse} from "../response/SingleAdminResponse";
import {Status} from "../../components/types/ResponseStatusTypes";
import {getConnection} from "typeorm";

@Resolver()
export class AdminResolver
{
    private adminRepo: AdminRepository;

    constructor() {
        this.adminRepo = new AdminRepository();
        this.adminRepo.init(getConnection());
    }

    @Authorized('ROLE_ADMIN')
    @Query(() => AdminResponse)
    async getAdmins(
        // @Arg('sort') sort: SortType,
        @Args() {id, pageOffset, find}: QueryArgs,
        @Arg('filters', { nullable: true }) filters?: AdminFilterInput
    ) {
        let response = new AdminResponse();

        response.result = await this.adminRepo.getList({filters, page: pageOffset, find});

        return response;
    }

    @Authorized('ROLE_ADMIN')
    @Query(() => SingleAdminResponse)
    async getAdmin(@Arg("id") id: number) {
        let response: SingleAdminResponse = new SingleAdminResponse();

        try {
            let admin: Admin | undefined = await this.adminRepo.findOneById(id);

            if (admin === undefined) {
                response.status = Status.NotFound;
                response.message = 'Operation failed, admin not found';
            }

            response.result = admin;
        } catch {
            response.status = Status.InternalError;
            response.message = 'Operation failed, something went wrong please try again later';
        }

        return response;
    }

    @Authorized('ROLE_ADMIN')
    @Mutation(() => SingleAdminResponse)
    async createAdmin(@Arg("data") data: CreateAdminInput) {
        let response: SingleAdminResponse = new SingleAdminResponse();

        await this.adminRepo.queryRunner.startTransaction();
        try {
            let admin = await this.adminRepo.create(data);
            response.result = await admin;
            await this.adminRepo.queryRunner.commitTransaction();
        } catch {
            await this.adminRepo.queryRunner.rollbackTransaction();
            response.status = Status.Error;
            response.message = 'Operation failed, unable to save admin data';
        } finally {
            await this.adminRepo.queryRunner.release();
        }

        return response;
    }

    @Authorized('ROLE_ADMIN')
    @Mutation(() => SingleAdminResponse)
    async updateAdmin(@Arg("id") id: number, @Arg("data") data: UpdateAdminInput) {
        let response: SingleAdminResponse = new SingleAdminResponse();

        await this.adminRepo.queryRunner.startTransaction();
        try {
            let admin = await this.adminRepo.findOneById( id );

            if (!admin) {
                response.status = Status.NotFound;
                response.message = 'Operation failed, admin not found';

                return response;
            }

            await this.adminRepo.update(admin, data);

            response.result = admin;
            await this.adminRepo.queryRunner.commitTransaction();
        } catch {
            await this.adminRepo.queryRunner.rollbackTransaction();
            response.status = Status.Error;
            response.message = 'Operation failed, unable to update admin data';
        } finally {
            await this.adminRepo.queryRunner.release();
        }

        return response;
    }

    @Authorized('ROLE_ADMIN')
    @Mutation(() => SingleAdminResponse)
    async removeAdmin(@Arg("id") id: number) {
        let response: SingleAdminResponse = new SingleAdminResponse();

        await this.adminRepo.queryRunner.startTransaction();
        try {
            let admin = await this.adminRepo.findOneById( id );

            if (!admin) {
                response.status = Status.NotFound;
                response.message = 'Operation failed, admin not found';

                return response;
            }

            await this.adminRepo.delete(admin);
            await this.adminRepo.queryRunner.commitTransaction();
        } catch {
            await this.adminRepo.queryRunner.rollbackTransaction();
            response.status = Status.Error;
            response.message = 'Operation failed, unable to delete admin data';
        } finally {
            await this.adminRepo.queryRunner.release();
        }

        return response;
    }
}
