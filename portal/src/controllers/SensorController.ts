import {Request, Response} from "express";
import {Api} from "../components/api";
import {GetQuery} from "../components/helpers";
import HubServices from "../services/HubServices";

class SensorController {
    public async indexView(request: Request, response: Response)
    {
        let viewData: any = {
            title: 'Upsense Portal | Manage Sensor'
        };
        return response.render('sensor/index.html.twig', viewData);
    }

    public async indexAction(request: Request, response: Response)
    {
        try {
            const endpoint = `sensors?${GetQuery(request)}`;
            const apiResponse = await Api(request, response).get(endpoint);

            return response.json({
                status: 'success',
                data: apiResponse.data.result
            });
        } catch (error) {
            return response.json({status: 'error'});
        }
    }

    public async createView(request: Request, response: Response)
    {
        let viewData: any = {
            title: 'Upsense Portal | Create Sensor',
        };

        return response.render('sensor/add.html.twig', viewData);
    }

    public async createAction(request: Request, response: Response)
    {
        try {
            const apiResponse = await Api(request, response).post('/sensors', {
                data: request.body.data || {}
            });

            return response.json({
                status: 'success',
                data: apiResponse.data
            });
        } catch (error) {
            // @ts-ignore
            console.log(error);
            return response.json({status: 'error', error: error.description.error});
        }
    }

    public async editView(request: Request, response: Response)
    {
        if (request.xhr) {
            try {
                const apiResponse =  await Api(request, response).get(`/sensors/${request.params.id}`);

                return response.json({
                    status: 'success',
                    data: apiResponse.data.result
                });
            } catch (error) {
                // @ts-ignore
                return response.json({status: 'error', error: error.description.error});
            }
        }

        let viewData: any = {
            title: 'Upsense Portal | Edit Sensor',
            sensorId: request.params.id
        };

        return response.render('sensor/edit.html.twig', viewData);
    }

    public async editAction(request: Request, response: Response)
    {
        try {
            const apiResponse = await Api(request, response).put(`/sensors/${request.params.id}`, {
                data: request.body.data || {}
            });

            return response.json({
                status: 'success',
                data: apiResponse.data.result
            });
        } catch (error) {
            // @ts-ignore
            return response.json({status: 'error', error: error.description.error});
        }
    }
}

export default new SensorController();
