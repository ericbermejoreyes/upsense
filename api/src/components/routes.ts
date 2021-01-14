import express, {Router} from 'express';
import {Controller} from './controller';

export default class Routes
{
    router: Router;
    controller: Controller;
    path: string;

    constructor(path: string, controller: any)
    {
        this.router = express.Router();
        this.controller = new controller();
        this.path = path;
    }

    /**
     * Get the router object
     */
    getRouter(): Router
    {
        return this.router;
    }

    /**
     * Get the main path for this route collection
     */
    getPath(): string
    {
        return this.path;
    }

    /**
     *
     * @param callback
     */
    registerRoutes(callback: Function): void {
        callback(this.router, this.controller);
    }
}
