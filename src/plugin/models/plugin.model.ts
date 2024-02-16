import { z } from 'zod';

export interface RequestHandlerOverwrites {
    authorize: (req: Request, res: Response) => void;
    oAuth_exchange: (req: Request) => void;
}

export const AuthorizationRequestParams = z.object({
    response_type: z.string(),
    client_id: z.string(),
    redirect_uri: z.string(),
    audience: z.string().optional(),
    scope: z.string().optional(),
});

export type AuthorizationRequestParams = z.infer<typeof AuthorizationRequestParams>;

export const OAuthExchangeRequestParams = z.object({
    grant_type: z.string(),
    client_id: z.string(),
    client_secret: z.string(),
    code: z.string(),
    redirect_uri: z.string(),
});
