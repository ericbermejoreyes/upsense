import Admin from '../entities/admin';
import connection from '../../components/connection';
const {BasicStrategy} = require('passport-http');
let passport = require('passport');

// digest authentication for requesting jwt token
passport.use(new BasicStrategy(
    (username: any, password: any, done: any) => {
        connection
            .then(async connection => {
                let adminRepository = connection.manager.getRepository(Admin);

                let admin: Admin | undefined = await adminRepository.findOne({username});

                if (!admin || !admin.validatePassword(password)) {
                    return done(null, false);
                }

                return done(null, admin);
            }).catch(error => {
                return done(error);
            });
    }
));

export default passport;
