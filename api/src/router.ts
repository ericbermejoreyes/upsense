import express, {Router} from 'express';
import Routes from './components/routes';
import path from 'path';
import connection from './components/connection';

let router: Router = express.Router();

/**
 * Collect all the route in this single Router object
 */

// add the imported routes here
let routes: Routes[] = [
    require('./v1/routes/authRoutes'),
    require('./v1/routes/adminRoutes'),
    require('./v1/routes/companyRoutes')
];

// register v1 apis
do {
    let route = routes.shift();

    if (route !== undefined) {
        router.use(path.posix.join('/api/v1', route.getPath()), route.getRouter());
    }
} while(routes.length > 0);

export default router;
