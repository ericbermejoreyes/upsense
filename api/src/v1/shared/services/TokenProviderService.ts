import { jwtConfig } from '../../../config';import { User } from '../entities/User';import { getRepository, Repository } from 'typeorm';import { RefreshToken } from '../../shared/entities/RefreshToken';const jwt = require('jsonwebtoken');export class TokenProviderService{    private tokenRepo: Repository<RefreshToken>    constructor() {        this.tokenRepo = getRepository(RefreshToken);    }    generateAccessToken(admin: User)    {        // create and sign the access token        return jwt.sign(            this.createUserPayload(admin),            jwtConfig.secret,        {                issuer: jwtConfig.issuer,                algorithm: jwtConfig.algorithm,                expiresIn: jwtConfig.expiry            });    }    async generateRefreshToken(user: User)    {        //create and sign the refresh token        const token = jwt.sign(            {                user: { id: user.id }            },            jwtConfig.secret,        {                issuer: jwtConfig.issuer,                algorithm: jwtConfig.algorithm,                expiresIn: jwtConfig.refreshExpiry            });        let refreshToken: RefreshToken | undefined = await this.tokenRepo.findOne({where: {user}});        if (!refreshToken) {            // create new refresh token if nothing exist            refreshToken = new RefreshToken();            refreshToken.user = user;        }        refreshToken.token = token;        user.refreshToken = refreshToken;        await this.tokenRepo.save(refreshToken);        return token;    }    private createUserPayload(user: User)    {        return {           user: {               image: user.image,               username: user.username,               firstName: user.firstName,               lastName: user.lastName,               mobile: user.mobile,               email: user.email,               id: user.id,               role: user.role,           }        }    }    public async verifyRefreshToken(token: string, decoded = null, error = '')    {        try {            decoded = jwt.verify(token, jwtConfig.refreshSecret)            return true;        } catch (e: any) {            error = e.message;            return false;        }    }}