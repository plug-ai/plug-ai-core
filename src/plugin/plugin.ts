import axios from 'axios';
import { canAccessOAuthProtectedRoute, canAccessServiceAuthProtectedRoute } from '../auth/auth.guard';
import {
    AIPlugConfig,
    AuthorizationRequestParams,
    ClientConfig,
    OAuthExchangeRequestParams,
    RequestHandlerOverwrites,
} from './models';
import { getConfig } from './plugin.utils';

export class Plugin {
    private config: AIPlugConfig = {} as any;

    constructor(clientConfig: ClientConfig, private overwrites?: RequestHandlerOverwrites) {
        this.config = getConfig(clientConfig.authConfig, clientConfig.getDocs);
    }

    async handlePluginPaths(req: Request, res: Response): Promise<any> {
        const { pathname } = new URL(req.url);

        if (pathname === this.config.auth.authorization_url) {
            return this.overwrites?.authorize(req, res) || this.handleAuthorize(req);
        }

        if (pathname === this.config.auth.client_url) {
            if (req.method === 'POST') {
                return this.overwrites?.oAuth_exchange(req) || this.handleOAuthExchange(req);
            }
        }

        if (pathname === this.config.api.url) {
            return this.handleDocs();
        }

        return new Response('Looks like there is nothing here.', {
            status: 404,
        });
    }

    canAccessAuthProtectedRoutes(req: Request): boolean {
        if (!canAccessOAuthProtectedRoute(req, this.config.auth.type)) {
            return false;
        }

        if (!canAccessServiceAuthProtectedRoute(req, this.config.auth.type)) {
            return false;
        }

        return true;
    }

    get configuration() {
        return this.config;
    }

    private async handleAuthorize(req: Request) {
        const authorizationEndpoint = new URL(`https://${process.env.OAUTH_DOMAIN}/authorize`);
        const { searchParams } = new URL(req.url);

        const params = {
            response_type: searchParams.get('response_type'),
            client_id: searchParams.get('client_id'),
            redirect_uri: searchParams.get('redirect_uri'),
            state: searchParams.get('state'),
        } as AuthorizationRequestParams;

        if (this.config.auth.scope) {
            params.scope = this.config.auth.scope;
        }
        if (process.env.OAUTH_API_AUDIENCE) {
            params.audience = process.env.OAUTH_API_AUDIENCE;
        }

        try {
            AuthorizationRequestParams.parse(params);
        } catch (error) {
            return new Response(
                `Bad Request, missing or incomplete query params provided: ${(error as Error).message}`,
                {
                    status: 400,
                },
            );
        }

        const queryParams = new URLSearchParams(params);
        const authUrl = `${authorizationEndpoint}?${queryParams}`;

        return Response.redirect(authUrl);
    }

    private async handleOAuthExchange(req: Request) {

        const data = await req.formData();

        const params = {
            client_secret: data.get('client_secret'),
            grant_type: data.get('grant_type'),
            client_id: data.get('client_id'),
            redirect_uri: data.get('redirect_uri'),
            code: data.get('code'),
        };

        Object.keys(params).forEach((key) => {
            if (!params[key]) {
                delete params[key];
            }
        });

        try {
            OAuthExchangeRequestParams.parse(params);
        } catch (error) {
            return new Response(`Bad Request, missing or incomplete request params: ${(error as Error).message}`, {
                status: 400,
            });
        }

        const body = JSON.stringify(params);

        const response = await axios.post(`https://${process.env.OAUTH_DOMAIN}/oauth/token`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return new Response(JSON.stringify(response.data), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    private async handleDocs() {
        const documentation = await this.config.api.getDocs(this.config.auth.type);

        console.log(documentation)
        // remove empty objects like components: {} from the documentation
        Object.keys(documentation).forEach((key) => {
            if (Object.keys(documentation[key]).length === 0) {
                delete documentation[key];
            }
        });

        return new Response(JSON.stringify(documentation));
    }
}
