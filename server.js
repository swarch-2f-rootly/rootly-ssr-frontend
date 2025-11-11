const { createServer: createHttpsServer } = require('https');
const { createServer: createHttpServer } = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');

// Cargar Next.js
const next = require('next');

// Determinar si estamos en modo desarrollo o producción
const dev = process.env.NODE_ENV !== 'production';

// Inicializar Next.js
const app = next({ dev });
const handle = app.getRequestHandler();

const enableHttps = String(process.env.ENABLE_HTTPS || 'true').toLowerCase() !== 'false';

let httpsOptions = null;
if (enableHttps) {
    const certPath = path.join(__dirname, 'certs');
    httpsOptions = {
        key: fs.readFileSync(path.join(certPath, 'localhost.key')),
        cert: fs.readFileSync(path.join(certPath, 'localhost.crt')),
    };
}

app.prepare().then(() => {
    const requestHandler = (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    };

    const port = process.env.PORT || 3001;
    const hostname = process.env.HOSTNAME || '0.0.0.0';

    const server = enableHttps
        ? createHttpsServer(httpsOptions, requestHandler)
        : createHttpServer(requestHandler);

    server.listen(port, hostname, (err) => {
        if (err) throw err;
        const protocol = enableHttps ? 'https' : 'http';
        console.log(`> Servidor ${protocol.toUpperCase()} listo en ${protocol}://${hostname}:${port}`);
    });
}).catch((err) => {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
});