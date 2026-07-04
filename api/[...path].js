const https = require('https');
const http = require('http');

module.exports = async (req, res) => {
    const targetPath = req.url.replace(/^\/api/, '/api');
    const targetUrl = `https://panda-farm-house.preview.emergentagent.com${targetPath}`;

    const headers = { ...req.headers };
    delete headers['host'];
    headers['host'] = 'panda-farm-house.preview.emergentagent.com';
    headers['origin'] = 'https://panda-farm-house.preview.emergentagent.com';
    headers['referer'] = 'https://panda-farm-house.preview.emergentagent.com/';

    // Set CORS headers on response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    return new Promise((resolve, reject) => {
        let body = [];
        req.on('data', chunk => body.push(chunk));
        req.on('end', () => {
            body = Buffer.concat(body);

            const url = new URL(targetUrl);
            const options = {
                hostname: url.hostname,
                port: 443,
                path: url.pathname + url.search,
                method: req.method,
                headers: {
                    ...headers,
                    'content-length': body.length,
                },
            };

            const proxyReq = https.request(options, (proxyRes) => {
                res.status(proxyRes.statusCode);
                Object.entries(proxyRes.headers).forEach(([key, value]) => {
                    if (!['transfer-encoding', 'content-encoding', 'access-control-allow-origin'].includes(key.toLowerCase())) {
                        res.setHeader(key, value);
                    }
                });

                let responseBody = [];
                proxyRes.on('data', chunk => responseBody.push(chunk));
                proxyRes.on('end', () => {
                    res.end(Buffer.concat(responseBody));
                    resolve();
                });
            });

            proxyReq.on('error', (err) => {
                res.status(500).json({ error: err.message });
                resolve();
            });

            if (body.length > 0) {
                proxyReq.write(body);
            }
            proxyReq.end();
        });
    });
};
