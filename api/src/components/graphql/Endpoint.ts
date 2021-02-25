import {JwtAuth} from "../security/JwtAuth";
import {buildSchema} from "type-graphql";
import {NonEmptyArray} from "type-graphql/dist/interfaces/NonEmptyArray";
import {AuthChecker} from "type-graphql/dist/interfaces";
import {ApolloServer} from "apollo-server-express";

interface EndpointOptions
{
    path: string;
    jwtAuthEnabled?: boolean;
    authChecker?: AuthChecker<any, any>;
    resolvers: NonEmptyArray<Function> | NonEmptyArray<string>;
    subscriptionServer?: any;
    app: any;
}

export class Endpoint
{
    path!: string;
    jwtAuthEnabled: boolean = false;
    authChecker: AuthChecker<any, any> = () => true;
    resolvers!: NonEmptyArray<Function> | NonEmptyArray<string>;
    app!: any;
    server!: any;
    jwt: JwtAuth;
    schema!: any;
    subscriptionServer: any = false;

    constructor(options: EndpointOptions) {
        this.jwt = new JwtAuth();

        this.resolvers = options.resolvers;
        this.app = options.app;
        this.path = options.path;

        this.authChecker = options.authChecker || this.authChecker;
        this.jwtAuthEnabled = options.jwtAuthEnabled || this.jwtAuthEnabled;

        this.subscriptionServer = options.subscriptionServer || false;
    }

    async init()
    {
        if (this.jwtAuthEnabled) {
            // if jwt auth is enabled check for token
            this.app.use(
                this.path,
                this.jwt.required,
                this.jwt.authenticationErrorHandler
            )
        } else {
            this.app.use(this.jwt.optional);
        }

        this.schema = await buildSchema({
            resolvers: this.resolvers,
            authChecker: this.authChecker
        });

        this.server = new ApolloServer({
            schema: this.schema,
            context: (args: any) => {
                if (!args.req) {
                    return {user: null};
                }
                const { user } = args.req.user || { user: null };
                return { user };
            }
        });

        if (this.subscriptionServer !== false) {
            this.server.installSubscriptionHandlers(this.subscriptionServer);
        }
        this.server.applyMiddleware({app: this.app, path: this.path});

        return this;
    }
}
