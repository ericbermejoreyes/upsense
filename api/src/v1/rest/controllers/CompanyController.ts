import {Request, Response} from 'express';
import Controller from '../../../components/controller';
import CompanyServices from '../services/CompanyServices';
import {ReturnableResponse} from "../objects/ReturnableResponse";


export default class CompanyController extends Controller
{
    async getCompaniesAction (request: Request, response: Response)
    {
        const companyServices = new CompanyServices((<any>request).user);
        const data: ReturnableResponse = await companyServices.getList(request);

        response
            .status(data.statusCode)
            .json(data.body);
    }

    async getCompanyAction (request: Request, response: Response)
    {
        //@ts-ignore
        const {user} = request;
        const companyServices = new CompanyServices(user);
        const data: ReturnableResponse = await companyServices.getOne(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }

    async postCompanyAction (request: Request, response: Response)
    {
        const companyServices: CompanyServices = new CompanyServices((<any>request).user);
        const data: ReturnableResponse = await companyServices.create(request);

        return response
            .status(data.statusCode)
            .json(data.body);
    }
}
