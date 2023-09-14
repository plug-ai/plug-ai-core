export const withPlugAI = async (nextConfig) => {
    const newRedirect = {
        source: '/.well-known/ai-plugin.json',
        destination: '/api/plugin/.well-known/ai-plugin.json',
        permanent: true,
    };

    // Check if 'redirects' is already defined in nextConfig
    if (nextConfig.redirects) {
        // Check if 'redirects' is an async function
        if (typeof nextConfig.redirects === 'function') {
            const originalRedirects = await nextConfig.redirects();
            nextConfig.redirects = async () => [...originalRedirects, newRedirect];
        } else {
            nextConfig.redirects.push(newRedirect);
        }
    } else {
        // If 'redirects' is not defined, define it
        nextConfig.redirects = async () => [newRedirect];
    }

    return nextConfig;
};
