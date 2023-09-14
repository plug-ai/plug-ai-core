import { PLUGIN_CONFIG } from './plugin.config';
import { AIPlugConfig, AIPlugInitConfig, OpenAPIConfig } from './models';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import path from 'path';

export function getConfig(pathToConfig: string, getApiDocs: () => Promise<OpenAPIConfig>): AIPlugConfig {
    try {
        const yaml = readFileSync(path.resolve(process.cwd(), pathToConfig), 'utf8');
        const clientConfig = load(yaml) as AIPlugInitConfig;
        const defaultConfig = PLUGIN_CONFIG;

        const config = {
            ...clientConfig,
            auth: {
                ...clientConfig.auth,
                ...defaultConfig.auth,
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
