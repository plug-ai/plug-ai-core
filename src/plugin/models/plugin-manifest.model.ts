type BaseManifestAuth = {
    type: ManifestAuthType;
};

export enum ManifestAuthType {
    None = 'none',
    OAuth = 'oauth',
    ServiceHttp = 'service_http',
    UserHttp = 'user_http',
}

export enum HttpAuthorizationType {
    Bearer = 'bearer',
    Basic = 'basic',
}

export type ManifestAuth = ManifestNoAuth | ManifestOAuthAuth | ManifestServiceHttpAuth | ManifestUserHttpAuth;

export type ManifestNoAuth = BaseManifestAuth & {
    type: ManifestAuthType.None;
};

export type ManifestServiceHttpAuth = BaseManifestAuth & {
    type: ManifestAuthType.ServiceHttp;
    authorization_type: HttpAuthorizationType;
    verification_tokens: {
        [service: string]: string;
    };
};

// User-level HTTP authentication
export type ManifestUserHttpAuth = BaseManifestAuth & {
    type: ManifestAuthType.UserHttp;
    authorization_type: HttpAuthorizationType;
};

export type ManifestOAuthAuth = BaseManifestAuth & {
    type: ManifestAuthType.OAuth;

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

export enum ManifestSchemaVersion {
    v1 = 'v1',
}

export type Manifest = {
    schema_version: ManifestSchemaVersion;
    name_for_human: string;
    name_for_model: string;
    description_for_human: string;
    description_for_model: string;
    auth: ManifestNoAuth | ManifestOAuthAuth | ManifestServiceHttpAuth | ManifestUserHttpAuth;
    api: {
        type: 'openapi';
        url: string;
    };
    logo_url: string;
    contact_email: string;
    legal_info_url: string;
};
