# Anti-Social UnaHur

API de red social construida con Node.js, Express y MongoDB. Permite gestionar usuarios, publicaciones, comentarios, tags, imágenes y seguidores. Utiliza bases de datos documentales para el almacenamiento principal y Redis para la gestión de caché.

### Pasos para probar:

```bash
# 1. Levantar los contenedores de MongoDB y Redis
docker-compose up -d

# 2. Iniciar el servidor
npm run dev
```

# 3. Importar el archivo deseado en Postman y probar los endpoints
Los requests están configurados en la colección para apuntar a `http://localhost:3000`.

* **Runtime**: Node.js 24+
* **Framework**: Express 5
* **ODM**: Mongoose 9
* **Validación**: Joi 18
* **Documentación**: OpenAPI 3.0 (Swagger)
* **Base de datos principal**: MongoDB
* **Caché**: Redis

## Instalación y uso

```bash
# 1. Clonar el repositorio
git clone https://github.com/EP-UnaHur-2026C1/anti-social-documental-tp-crearnombre-req-res.git
cd anti-social-documental-tp-crearnombre-req-res

# 2. Instalar dependencias
npm install

# 3. Levantar los servicios de base de datos y caché
docker-compose up -d

# 4. Iniciar servidor
npm run dev
```

## Pruebas con Postman

Hay un archivo en la raíz del proyecto para probar en Postman:

| Archivo | Descripción |
|---|---|
| `postman_collection.json` | Colección completa con estructura + datos precargados listos para usar en todas las entidades |

El servidor se levanta en `http://localhost:3000` (o el puerto configurado en PORT).

## Scripts

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor con Node |
| `npm run dev` | Inicia el servidor con Nodemon (recarga automática) |

## Variables de entorno (.env)

| Variable | Obligatoria | Default | Descripción |
|---|---|---|---|
| `PORT` | No | `3000` | Puerto del servidor |
| `MONGO_URI` | Sí | `mongodb://...` | Cadena de conexión a MongoDB |
| `REDIS_URL` | Sí | `redis://localhost:6379` | Cadena de conexión a Redis |
| `COMENTARIOS_LIMITE_MESES` | No | `6` | Meses de antigüedad máxima para comentarios visibles |

## Estructura del proyecto

```text
├── app.js                    # Punto de entrada
├── config/
│   ├── db.js                 # Configuración de Mongoose (MongoDB)
│   └── redis.js              # Configuración de cliente Redis
├── controllers/              # Lógica de negocio
│   ├── users.controllers.js
│   ├── posts.controllers.js
│   ├── comments.controllers.js
│   └── tags.controllers.js
├── middlewares/              # Validación
│   ├── validarUser.middlewares.js
│   ├── validarPost.middlewares.js
│   ├── validarComments.middlewares.js
│   ├── validarTag.middlewares.js
│   └── validarImages.middlewares.js
├── models/                   # Modelos Mongoose (Schemas)
│   ├── User.js
│   ├── Post.js               # Contiene embebido el schema de imágenes
│   ├── Comment.js
│   ├── Tag.js
│   └── Follower.js
├── routes/                   # Definición de rutas
│   ├── users.routes.js
│   ├── posts.routes.js
│   ├── comments.routes.js
│   └── tags.routes.js
├── schemas/                  # Schemas de validación con Joi
├── utils/
│   └── imagen.utils.js       # Utilidad para descargar imágenes por URL
├── images/                   # Carpeta estática para imágenes descargadas localmente
├── swagger.yaml              # Documentación OpenAPI 3.0
├── postman_collection.json   # Colección de pruebas de Postman
├── docker-compose.yml        # Configuración de contenedores (Mongo, Redis)
└── .env                      # Variables de entorno
```

## API Endpoints

### Usuarios
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/users` | Crear usuario |
| GET | `/users` | Listar usuarios |
| GET | `/users/:id` | Obtener usuario por ID |
| PUT | `/users/:id` | Actualizar usuario |
| DELETE | `/users/:id` | Eliminar usuario |
| GET | `/users/:id/posts` | Obtener posts del usuario |

### Seguidores
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/users/:id/follow` | Seguir a un usuario |
| DELETE | `/users/:id/follow` | Dejar de seguir a un usuario |
| GET | `/users/:id/followers`| Obtener seguidores de un usuario |
| GET | `/users/:id/following`| Obtener usuarios seguidos |

### Posts
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/posts` | Crear un post |
| GET | `/posts` | Ver todos los posts (trae comentarios visibles) |
| GET | `/posts/:id` | Obtener un post por ID (con caché en Redis) |
| PUT | `/posts/:id` | Actualizar un post |
| DELETE | `/posts/:id` | Eliminar un post |

### Imágenes de Post (Subdocumento)
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/posts/:id/imagenes` | Agregar imagen a un post |
| DELETE | `/posts/:id/imagenes/:imageId` | Eliminar imagen de un post |

### Etiquetas en Posts (Relación)
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/posts/:id/tags` | Asociar un tag al post |
| DELETE | `/posts/:id/tags/:tagId`| Desasociar tag del post |

### Comentarios
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/comments` | Crear nuevo comentario |
| GET | `/comments/:commentId`| Mostrar comentario por ID |
| GET | `/comments/post/:postId`| Mostrar comentarios de un post |
| PUT | `/comments/:commentId`| Actualizar comentario |
| DELETE | `/comments/:commentId`| Eliminar comentario |

### Tags
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/tags` | Crear nuevo tag |
| GET | `/tags` | Mostrar todos los tags |
| GET | `/tags/:id` | Obtener tag por ID |
| PUT | `/tags/:id` | Actualizar tag |
| DELETE | `/tags/:id` | Eliminar tag |

## Documentación Swagger

El archivo `swagger.yaml` contiene la especificación OpenAPI 3.0 completa de todos los endpoints. Podés visualizarlo levantando el proyecto e ingresando a `http://localhost:3000/api-docs`.

## Estrategia de Caché

La aplicación implementa Redis para reducir las consultas constantes a MongoDB, optimizando la lectura de publicaciones (`/posts/:id`). La caché se invalida o actualiza automáticamente cuando un post sufre modificaciones (edición, se añaden tags o imágenes).
