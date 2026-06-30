const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'images');

if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

function descargarImagen(url, depth = 0) {
    if (depth > 3) return Promise.reject(new Error('Demasiadas redirecciones'));
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const parsedUrl = new URL(url);
        const options = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + parsedUrl.search,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
            }
        };
        const request = client.get(options, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                response.resume();
                return descargarImagen(response.headers.location, depth + 1).then(resolve).catch(reject);
            }
            if (response.statusCode !== 200) {
                response.resume();
                return reject(new Error(`Status ${response.statusCode}`));
            }
            const contentType = response.headers['content-type'] || '';
            if (!contentType.startsWith('image/')) {
                response.resume();
                return reject(new Error('La URL no apunta a una imagen'));
            }
            let ext = (contentType.split('/')[1] || 'jpg').split(';')[0].trim();
            if (ext === 'jpeg') ext = 'jpg';
            const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
            const filepath = path.join(IMAGES_DIR, filename);
            const fileStream = fs.createWriteStream(filepath);
            response.pipe(fileStream);
            fileStream.on('finish', () => { fileStream.close(); resolve(filename); });
            fileStream.on('error', (err) => { fs.unlink(filepath, () => {}); reject(err); });
        });
        request.setTimeout(7000, () => { request.destroy(); reject(new Error('Timeout')); });
        request.on('error', reject);
    });
}

module.exports = { descargarImagen };