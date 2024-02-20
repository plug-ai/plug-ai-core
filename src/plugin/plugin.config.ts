export const PLUGIN_CONFIG = {
    auth: {
        client_url: '/api/plugin/oauth/token',
        authorization_url: '/api/plugin/authorize',
        authorization_content_type: 'application/json',
    },
    api: {
        type: 'openapi',
        url: '/api/plugin/openapi',
    },
};