type BaseAuth = {
    type: PluginAuthType;
};

export enum PluginAuthType {
    None = 'none',
    OAuth = 'oauth',
    ServiceHttp = 'service_http',
}

export enum HttpAuthorizationType {
    Bearer = 'bearer',
    Basic = 'basic',
}

export type ManifestAuth = NoAuth | OAuthAuth | ServiceHttpAuth;

export type NoAuth = BaseAuth & {
    type: PluginAuthType.None;
};

export type ServiceHttpAuth = BaseAuth & {
    type: PluginAuthType.ServiceHttp;
    authorization_type: HttpAuthorizationType;
};

export type OAuthAuth = BaseAuth & {
    type: PluginAuthType.OAuth;

    // OAuth URL where a user is directed to for the OAuth authentication flow to begin.
    client_url: string;

    // OAuth scopes required to accomplish operations on the user's behalf.
    scope: string;

    // Endpoint used to exchange OAuth code with access token.
    authorization_url: string;

    // When exchanging OAuth code with access token, the expected header 'content-type'. For example: 'content-type: application/json'
    authorization_content_type: string;

    // When registering the OAuth client ID and secrets, the plugin service will surface a unique token.
    verification_tokens: {
        [service: string]: string;
    };
};