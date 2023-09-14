import { ManifestAuthType, getConfig } from '../index';

describe('getConfig', () => {
    afterEach(() => {
        require('js-yaml').setConfig({});
    });

    it('should return a correct configuration object given correct config input', () => {
        // GIVEN
        const pathToMockConfig = './__tests__/mocks/client-config.yaml';
        const getDocs = () =>
            Promise.resolve({ paths: {}, openapi: '3.0.0', info: { title: 'test', version: '1.0.0' } });
        require('js-yaml').setConfig();

        // WHEN
        const configuration = getConfig(pathToMockConfig, getDocs);

        // THEN
        expect(configuration).toStrictEqual({
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
                getDocs: getDocs,
            },
        });
    });

    it('should throw an error if config input does not include all required params', () => {
        // GIVEN
        jest.mock('js-yaml');
        const pathToMockConfig = './__tests__/mocks/client-config.yaml';
        const getDocs = () =>
            Promise.resolve({ paths: {}, openapi: '3.0.0', info: { title: 'test', version: '1.0.0' } });
        require('js-yaml').setConfig({
            info: {
                description: {
                    human: 'Human description of the test plugin.',
                    model: 'Model description of the test plugin.',
                },
                logo_url: '/logo',
                contact_email: '@contact',
                legal_info_url: '/legal',
            },
            auth: {
                type: 'service_http',
                scope: 'read',
                verification_tokens: {
                    openai: '',
                },
            },
        });

        // THEN
        expect(() => {
            getConfig(pathToMockConfig, getDocs);
        }).toThrowError();
    });
});
