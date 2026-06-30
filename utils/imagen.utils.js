const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'images');

if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

function descargarImagen(url, depth = 0) {
    if (depth > 3) return Promise.reject(new Error('Demasiadas redirecciones')); // Limitar la profundidad de redirecciones a 3 , la profundidad es para evitar bucles infinitos en caso de redirecciones circulares. 
                                                                                // Devuelve una promesa rechazada con un error si se excede la profundidad máxima de redirecciones. se usa una promesa porque la descarga de la imagen es una operación asíncrona y queremos manejarla de manera eficiente.
    return new Promise((resolve, reject) => { // Se utiliza una promesa para manejar la descarga de la imagen de manera asíncrona.
        const client = url.startsWith('https') ? https : http; // Se determina si se debe usar el módulo https o http según el esquema de la URL. Esto permite manejar tanto URLs seguras (https) como no seguras (http).
        const parsedUrl = new URL(url); // Se analiza la URL proporcionada para extraer componentes como el hostname, pathname y search. Esto facilita la construcción de la solicitud HTTP.
        const options = { // Se crean las opciones para la solicitud HTTP, incluyendo el hostname, path y encabezados personalizados. Los encabezados incluyen un User-Agent y un Accept para indicar que se aceptan imágenes en varios formatos.
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + parsedUrl.search,
            headers: { // Se definen los encabezados HTTP para la solicitud. El User-Agent simula un navegador web y el Accept indica que se aceptan imágenes en varios formatos, incluyendo WebP y APNG.
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
            }
        };
        const request = client.get(options, (response) => {  // funcion para manejar la respuesta del servidor
            if (response.statusCode === 301 || response.statusCode === 302) { // Si la respuesta es una redirección (códigos de estado 301 o 302), se obtiene la nueva ubicación de la imagen desde los encabezados de la respuesta y se llama recursivamente a descargarImagen con la nueva URL y un incremento en la profundidad.
                response.resume(); // Se llama a response.resume() para descartar los datos de la respuesta anterior y liberar recursos. Esto es importante para evitar fugas de memoria al manejar redirecciones.
                return descargarImagen(response.headers.location, depth + 1).then(resolve).catch(reject); // Se llama recursivamente a descargarImagen con la nueva URL y un incremento en la profundidad. Se utiliza .then(resolve).catch(reject) para propagar el resultado de la promesa a la promesa principal.
            }
            if (response.statusCode !== 200) { // Si la respuesta no es exitosa (código de estado diferente a 200), se descarta la respuesta y se rechaza la promesa con un error que indica el código de estado recibido. Esto permite manejar errores de manera adecuada.
                response.resume();
                return reject(new Error(`Status ${response.statusCode}`)); // Se rechaza la promesa con un error que indica el código de estado recibido. Esto permite manejar errores de manera adecuada.
            }
            const contentType = response.headers['content-type'] || ''; // Se obtiene el tipo de contenido de la respuesta desde los encabezados. Si no se encuentra el encabezado, se asigna una cadena vacía. Esto permite verificar si la URL apunta a una imagen.
            if (!contentType.startsWith('image/')) { // Si el tipo de contenido no indica que es una imagen, se descarta la respuesta y se rechaza la promesa con un error que indica que la URL no apunta a una imagen. Esto permite manejar casos en los que la URL no es válida para descargar una imagen.
                response.resume(); // 
                return reject(new Error('La URL no apunta a una imagen')); // Se rechaza la promesa con un error que indica que la URL no apunta a una imagen. Esto permite manejar casos en los que la URL no es válida para descargar una imagen.
            }
            let ext = (contentType.split('/')[1] || 'jpg').split(';')[0].trim(); // Se obtiene la extensión del archivo a partir del tipo de contenido. Si no se encuentra una extensión válida, se asigna 'jpg' como valor predeterminado. Esto permite determinar el formato de la imagen descargada.
            if (ext === 'jpeg') ext = 'jpg'; // Se normaliza la extensión 'jpeg' a 'jpg' para mantener consistencia en los nombres de archivo. Esto evita confusiones al manejar archivos con diferentes extensiones para el mismo formato de imagen.
            const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`; // Se genera un nombre de archivo único utilizando la marca de tiempo actual y una cadena aleatoria. Esto ayuda a evitar colisiones de nombres de archivo al descargar múltiples imágenes. La extensión se agrega al final del nombre de archivo para indicar el formato de la imagen.
            const filepath = path.join(IMAGES_DIR, filename); // Se construye la ruta completa del archivo utilizando el directorio de imágenes y el nombre de archivo generado. Esto permite guardar la imagen descargada en la ubicación deseada.
            const fileStream = fs.createWriteStream(filepath); // Se crea un flujo de escritura para el archivo en la ruta especificada. Esto permite escribir los datos de la imagen descargada en el sistema de archivos.
            response.pipe(fileStream); // Se canaliza la respuesta del servidor al flujo de escritura del archivo. Esto permite guardar los datos de la imagen descargada directamente en el archivo sin necesidad de almacenarlos en memoria.
            fileStream.on('finish', () => { fileStream.close(); resolve(filename); }); // Se escucha el evento 'finish' del flujo de escritura para cerrar el flujo y resolver la promesa con el nombre del archivo descargado. Esto indica que la descarga se completó exitosamente.
            fileStream.on('error', (err) => { fs.unlink(filepath, () => {}); reject(err); }); // Se escucha el evento 'error' del flujo de escritura para eliminar el archivo parcialmente escrito y rechazar la promesa con el error. Esto permite manejar errores durante la escritura del archivo y evitar dejar archivos incompletos en el sistema de archivos.
        });
        request.setTimeout(7000, () => { request.destroy(); reject(new Error('Timeout')); }); // Se establece un tiempo de espera de 7000 milisegundos (7 segundos) para la solicitud. Si la solicitud no se completa dentro de este tiempo, se destruye la solicitud y se rechaza la promesa con un error de tiempo de espera. Esto ayuda a evitar bloqueos prolongados en caso de problemas de red o servidores lentos.
        request.on('error', reject); // Se escucha el evento 'error' de la solicitud para rechazar la promesa con el error. Esto permite manejar errores de red o problemas con la solicitud HTTP de manera adecuada.
    });
}

module.exports = { descargarImagen };