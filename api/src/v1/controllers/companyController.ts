import {Request, Response} from 'express';
import Controller from '../../components/controller';
import companyValidator from '../validators/companyValidator';
import CompanyServices from '../services/companyServices';


export default class CompanyController extends Controller
{
    async getCompaniesAction(request: Request, response: Response)
    {
        let companyServices = new CompanyServices((<any>request).user);
        let companies = await companyServices.getCompanyResourceList();

        response
            .status(200)
            .json(companies.map((company: any) => { return company.serialize(); }));
    }

    async postCompanyAction(request: Request, response: Response)
    {
        let companyServices = new CompanyServices((<any>request).user);
        let body = request.body

        // do validation before proceed
        let validation = companyValidator(body);

        validation.checkAsync(async () => {
            // success callback
            await companyServices.createCompanyResource(body.company);

            response
                .status(200)
                .json({ message: 'Operation successful' });
        }, () => {
            // fail callback
            response
                .status(400)
                .json({
                    message: 'Operation failed',
                    errorMessage: validation.errors.all()
                });
        });
    }
}
