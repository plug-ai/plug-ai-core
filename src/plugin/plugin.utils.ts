import { PLUGIN_CONFIG } from './plugin.config';
import { AIPlugConfig, PluginAuthType, OpenAPIConfig } from './models';

export function getConfig(authType: PluginAuthType, getApiDocs: (authType: PluginAuthType) => Promise<OpenAPIConfig>): AIPlugConfig {
    try {
        const defaultConfig = PLUGIN_CONFIG;

        const config = {
            auth: {
                ...defaultConfig.auth,
                type: authType
            },
            api: {
                ...defaultConfig.api,
                getDocs: getApiDocs,
            },
        };

        AIPlugConfig.parse(config);
        return config;
    } catch (error) {
        throw Error(`Error while loading plugin configuration: ${(error as Error).message}`);
    }
}
