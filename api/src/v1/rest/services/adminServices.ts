import {Admin} from '../../entities/Admin';
import {getRepository, Like} from 'typeorm';
import {paginationConfig} from "../../../config";
import ApiFilter from '../filters/apiFilter';

export default class AdminServices
{
    private user: any;
    private adminRepository: any;

    /**
     *
     * @param user
     * @param em
     */
    constructor(user: any) {
        this.user = user;
        this.adminRepository = getRepository(Admin);
    }

    async getAdminResourceList(filter: ApiFilter)
    {
        let admins: Admin[] = await this.adminRepository.find({}, filter.getArgs());

        return admins;
    }

    /**
     *
     * @param admin
     */
    async createAdminResource(data: any)
    {
        let admin: Admin = new Admin();

        admin.username = data.username;
        admin.password = data.password;
        admin.firstName = data.firstName;
        admin.lastName = data.lastName;
        admin.email = data.email;
        admin.mobileNumber = data.mobileNumber;
        admin.role = 'ROLE_ADMIN'; // TODO: this should not be hardcoded

        this.adminRepository.save(admin);

        return admin;
    }

    /**
     * delete admin resource
     * @param admin
     */
    async deleteAdminResource(admin: Admin | Admin[])
    {
        this.adminRepository.remove(admin);

        return this;
    }
}