import axios from 'axios';
import { ManifestAuthType, Plugin } from '../index';
import * as configModule from '../src/plugin/plugin.utils';

let plugin: Plugin;

beforeAll(() => {
    const getConfigSpy = jest.spyOn(configModule, 'getConfig');
    getConfigSpy.mockReturnValue({
        info: {
            name: {
                human: 'test_plugin',
                model: 'test_plugin',
            },
            description: {
                human: 'Human description of the test plugin.',
                model: 'Model description of the test plugin.',
            },
            logo_url: '/logo',
            contact_email: '@contact',
            legal_info_url: '/legal',
        },
        auth: {
            type: ManifestAuthType.ServiceHttp,
            client_url: '/api/plugin/oauth/token',
            authorization_url: '/api/plugin/authorize',
            authorization_content_type: 'application/json',
            verification_tokens: { openai: '' },
            scope: 'read',
        },
        api: {
            type: 'openapi',
            url: '/api/plugin/openapi',
            getDocs: () =>
                Promise.resolve({
                    openapi: '3.0.0',
                    info: {
                        title: 'test',
                        version: '1.0.0',
                    },
                    paths: {docs: "documentation"},
                }),
        },
    });

    plugin = new Plugin({
        configFilePath: '',
        getDocs: () => Promise.resolve({ paths: {docs: "documentation"}, openapi: '3.0.0', info: { title: 'test', version: '1.0.0' } }),
    });
});

describe('Plugin - handlePluginPaths - handleAuthorize', () => {
    it('should return a redirect error when provided with mock oAuth values and request path points to oauth autorization endpoint', async () => {
        // GIVEN
        const REDIRECT_TARGET_UNAVAILABLE_STATUS = 302;
        const authorizeUrl = plugin.configuration.auth.authorization_url;

        const queryParams = new URLSearchParams({
            response_type: 'application/json',
            client_id: process.env.CLIENT_ID as string,
            client_secret: process.env.CLIENT_SECRET as string,
            redirect_uri: process.env.REDIRECT_URI as string,
            audience: process.env.OAUTH_API_AUDIENCE as string,
            scope: 'offline_access',
        });

        // WHEN
        const request = new Request(`${process.env.BASE_URL}${authorizeUrl}?${queryParams}`);
        const res = await plugin.handlePluginPaths(request, new Response());

        // THEN
        expect(res.status).toBe(REDIRECT_TARGET_UNAVAILABLE_STATUS);
    });

    it('should return a bad request error when one or more query params are missing and request path points to oauth autorization endpoint', async () => {
        // GIVEN
        const authorizeUrl = plugin.configuration.auth.authorization_url;
        const queryParams = new URLSearchParams({
            response_type: 'application/json',
            redirect_uri: process.env.REDIRECT_URI as string,
            audience: process.env.OAUTH_API_AUDIENCE as string,
            scope: 'offline_access',
        });

        // WHEN
        const request = new Request(`${process.env.BASE_URL}${authorizeUrl}?${queryParams}`);
        const res = await plugin.handlePluginPaths(request, new Response());

        // THEN
        expect(res.status).toBe(400);
    });
});

describe('Plugin - handlePluginPaths - handleOAuthExchange', () => {
    it('should return a 400 error response when one or more OAuth params are missing', async () => {
        // GIVEN
        const oAuthExchangeUrl = plugin.configuration.auth.client_url;
        const request = new Request(`${process.env.BASE_URL}${oAuthExchangeUrl}`, {
            method: 'POST',
            body: '{}',
        });

        // WHEN
        const res = await plugin.handlePluginPaths(request, new Response());

        // THEN
        expect(res.status).toBe(400);
    });

    it('should return a successful response when all required OAuth params are present and the external API responds successfully', async () => {
        // GIVEN
        const oAuthExchangeUrl = plugin.configuration.auth.client_url;
        const requestBody = JSON.stringify({
            grant_type: 'grant_type_test',
            client_id: 'client_id_test',
            client_secret: 'client_secret_test',
            code: 'code_test',
            redirect_uri: 'redirect_uri_test',
        });

        const request = new Request(`${process.env.BASE_URL}${oAuthExchangeUrl}`, {
            method: 'POST',
            body: requestBody,
        });

        // // WHEN
        const spy = jest.spyOn(axios, 'post');
        spy.mockReturnValue(Promise.resolve({ data: 'jwt_access_token' }));
        const res = await plugin.handlePluginPaths(request, new Response());

        const resValue = await res.json();

        // // THEN
        expect(resValue).toBe('jwt_access_token');
    });
});

describe('Plugin Request Handler - test documentation path handling', () => {
    it('should return a documentation object value', async () => {
        // Given
        const pathToDocumentation = plugin.configuration.api.url;
        const req = new Request(`${process.env.BASE_URL}${pathToDocumentation}`);

        // When
        const response = await plugin.handlePluginPaths(req, new Response());
        const responseData = await response.json();

        // Then
        expect(responseData).toEqual({ paths: {docs: "documentation"}, openapi: '3.0.0', info: { title: 'test', version: '1.0.0' } });
    });
});

describe('Plugin Request Handler - test manifest path handling', () => {
    it('should return plugin manifest', async () => {
        // Given
        const pathToManifest = '/api/plugin/.well-known/ai-plugin.json';
        const req = new Request(`${process.env.BASE_URL}${pathToManifest}`);

        // When
        const response = await plugin.handlePluginPaths(req, new Response());
        const manifest = await response.json();

        // Then
        expect(manifest.name_for_human).toBeDefined();
        expect(manifest.name_for_model).toBeDefined();
        expect(manifest.description_for_human).toBeDefined();
        expect(manifest.description_for_model).toBeDefined();
        expect(manifest.auth).toBeDefined();
        expect(manifest.api).toBeDefined();
        expect(manifest.logo_url).toBeDefined();
        expect(manifest.contact_email).toBeDefined();
        expect(manifest.legal_info_url).toBeDefined();
    });
});
