import {Request, Response} from "express";
import {Api} from "../components/api";
import moment from "moment";
import CompanyServices from "../services/CompanyServices";

class CompanyController
{
    public async indexView(request: Request, response: Response)
    {
        let viewData: any = {
            title: 'Upsense Portal | Manage Company'
        };
        return response.render('company/index.html.twig', viewData);
    }

    public async indexAction(request: Request, response: Response)
    {
        try {
            const apiResponse = await Api(request, response).get('/companies');

            return response.json({
                status: 'success',
                data: apiResponse.data.result
            });
        } catch (error) {
            return response.json({status: 'error'});
        }
    }

    public async detailView(request: Request, response: Response)
    {
        if (request.xhr) {
            const details = await CompanyServices.getCompanyDetails(request, response);
            return response.json(details);
        }

        let viewData: any = {
            title: 'Upsense Portal | Company Details',
            companyId: request.params.id
        };
        return response.render('company/detail.html.twig', viewData);
    }

    public async createView(request: Request, response: Response)
    {
        let viewData: any = {
            title: 'Upsense Portal | Create Company'
        };

        return response.render('company/add.html.twig', viewData);
    }

    public async createAction(request: Request, response: Response)
    {
        try {
            const apiResponse = await Api(request, response).post('/companies', {
                data: request.body.data || {}
            });

            return response.json({
                status: 'success',
                data: apiResponse.data
            });
        } catch (error) {
            // @ts-ignore
            return response.json({status: 'error', error: error.description.error});
        }
    }

    public async editView(request: Request, response: Response)
    {
        if (request.xhr) {
            const details = await CompanyServices.getCompanyDetails(request, response);
            return response.json(details);
        }

        let viewData: any = {
            title: 'Upsense Portal | Edit Company',
            companyId: request.params.id
        };

        return response.render('company/edit.html.twig', viewData);
    }

    public async editAction(request: Request, response: Response)
    {
        try {
            const apiResponse = await Api(request, response).put(`/companies/${request.body.id}`, {
                data: request.body.data || {}
            });

            return response.json({
                status: 'success',
                data: apiResponse.data
            });
        } catch (error) {
            // @ts-ignore
            return response.json({status: 'error', error: error.description.error});
        }
    }
}

export default new CompanyController();