import * as jwt from 'jsonwebtoken';
import { PluginAuthType } from '../plugin';

export const canAccessOAuthProtectedRoute = (req: Request, authType: PluginAuthType): boolean => {
    if (authType === PluginAuthType.OAuth) {
        const certificate_encoded = process.env.PUBLIC_KEY;

        if (!certificate_encoded) {
            throw new Error('Public key missing. Please add it to env under PUBLIC_KEY key');
        }

        const authHeader = req.headers.get('Authorization');

        if (authHeader) {
            const certificate = Buffer.from(certificate_encoded, 'base64').toString('utf-8');
            try {
                jwt.verify(authHeader.replace('Bearer ', ''), certificate);
                return true;
            } catch (e) {
                console.log('verification error', e);
                return false;
            }
        } else {
            throw new Error('Auth header is missing ');
        }
    } else {
        return true;
    }
};

export const canAccessServiceAuthProtectedRoute = (req: Request, authType: PluginAuthType): boolean => {
    if (authType === PluginAuthType.ServiceHttp) {
        const service_auth_key = process.env.SERVICE_AUTH_KEY;

        if (!service_auth_key) {
            throw new Error('Service access token is missing. Please add it to env under SERVICE_AUTH_KEY key');
        }

        const auth_token = req.headers.get('Authorization');

        if (auth_token) {
            return auth_token === `Bearer ${service_auth_key}`;
        } else {
            throw new Error('Auth header is missing');
        }
    } else {
        return true;
    }
};
