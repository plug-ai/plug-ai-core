'use strict';
const jsYaml = jest.createMockFromModule('js-yaml');

let config = null;

jsYaml.setConfig = function(configOverwrite) {
    config = configOverwrite || {
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
            type: 'service_http',
            scope: 'read',
            verification_tokens: {
                openai: '',
            },
        },
    };
}

jsYaml.load = function () {
    return config;
}

module.exports = jsYaml;