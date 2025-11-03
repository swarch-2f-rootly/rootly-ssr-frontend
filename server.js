const { createServer } = require('https');
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

// Ruta a los certificados SSL
const certPath = path.join(__dirname, 'certs');
const httpsOptions = {
    key: fs.readFileSync(path.join(certPath, 'localhost.key')),
    cert: fs.readFileSync(path.join(certPath, 'localhost.crt')),
};

app.prepare().then(() => {
    const server = createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const port = process.env.PORT || 3001;
    const hostname = process.env.HOSTNAME || '0.0.0.0';
    
    server.listen(port, hostname, (err) => {
        if (err) throw err;
        console.log(`> Servidor HTTPS listo en https://${hostname}:${port}`);
    });
}).catch((err) => {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
});