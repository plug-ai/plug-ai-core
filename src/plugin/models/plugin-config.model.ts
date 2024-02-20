import { z } from 'zod';
import { PluginAuthType, HttpAuthorizationType } from './plugin-auth.model';

export const OpenAPIConfig = z.object({
    paths: z.record(z.any()),
    openapi: z.string(),
    info: z.object({ title: z.string(), version: z.string() }),
    servers: z.array(z.any())
});

export const AIPlugConfig = z.object({
    auth: z.object({
        type: z.nativeEnum(PluginAuthType),
        client_url: z.string(),
        authorization_url: z.string(),
        authorization_content_type: z.string(),
        authorization_type: z.nativeEnum(HttpAuthorizationType).optional(),
        scope: z.string().optional(),
    }),
    api: z.object({
        type: z.string(),
        url: z.string(),
        getDocs: z.function().args(z.any()).returns(z.promise(OpenAPIConfig)),
    }),
});

export type AIPlugConfig = z.infer<typeof AIPlugConfig>;

export type OpenAPIConfig = z.infer<typeof OpenAPIConfig>;

export interface AIPlugInitConfig {
    info: {
        name: {
            human: string;
            model: string;
        };
        description: {
            human: string;
            model: string;
        };
        logo_url: string;
        contact_email: string;
        legal_info_url: string;
    };
    auth: {
        type: PluginAuthType;
        scope: string;
        verification_tokens: {
            openai: string;
        };
    };
    getDocs: () => Promise<OpenAPIConfig>; // We probably want to change that fn interface to sth more generic - next-swagger-docs returns this kind of object but other docs libraries might return sth different
}

export interface ClientConfig {
    authConfig: PluginAuthType;
    getDocs: (authType: PluginAuthType) => Promise<OpenAPIConfig>;
}
