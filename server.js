(async () => {
    const httpsModule = await import('node:https');
    const httpModule = await import('node:http');
    const urlModule = await import('node:url');
    const pathModule = await import('node:path');
    const fsModule = await import('node:fs');
    const nextModule = await import('next');

    const { createServer: createHttpsServer } = httpsModule;
    const { createServer: createHttpServer } = httpModule;
    const { parse } = urlModule;
    const path = pathModule.default ?? pathModule;
    const fs = fsModule.default ?? fsModule;
    const next = nextModule.default ?? nextModule;

    // Determinar si estamos en modo desarrollo o producción
    const dev = process.env.NODE_ENV !== 'production';

    // Inicializar Next.js
    const app = next({ dev });
    const handle = app.getRequestHandler();

    const enableHttps = String(process.env.ENABLE_HTTPS || 'true').toLowerCase() !== 'false';

    let httpsOptions = null;
    if (enableHttps) {
        const certPath = process.env.SSL_CERT_PATH || path.join(__dirname, 'certs/localhost.crt');
        const keyPath = process.env.SSL_KEY_PATH || path.join(__dirname, 'certs/localhost.key');

        httpsOptions = {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath),
        };
    }

    try {
        await app.prepare();

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
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
})();