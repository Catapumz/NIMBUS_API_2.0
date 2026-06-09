# NIMBUS API 2.0 — Documentación Completa de Arquitectura

> Sistema de gestión de paredes de escalada (NIMBUS WALLS)  
> Stack: Node.js · Express · MongoDB · Docker · Multer  
> Base URL (producción): `http://api-main.nimbuswalls.com`  
> Swagger UI: `http://api-main.nimbuswalls.com/documentacion`

---

## Índice

1. [Visión General](#1-visión-general)
2. [Infraestructura & Deploy](#2-infraestructura--deploy)
3. [Base de Datos](#3-base-de-datos)
4. [Modelos de Datos](#4-modelos-de-datos)
5. [Endpoints — Referencia Completa](#5-endpoints--referencia-completa)
   - [Rutas de Escalada (Vías/Bloques)](#a-rutas-de-escalada-víasbloques)
   - [Fotos](#b-fotos)
   - [Layouts LED](#c-layouts-led)
   - [APK Distribution](#d-apk-distribution)
   - [Utilidades](#e-utilidades)
6. [Flujos de Datos Clave](#6-flujos-de-datos-clave)
7. [Autenticación & Seguridad](#7-autenticación--seguridad)
8. [Archivos & Almacenamiento](#8-archivos--almacenamiento)
9. [Scripts de Mantenimiento](#9-scripts-de-mantenimiento)
10. [Estructura del Proyecto](#10-estructura-del-proyecto)
11. [Dependencias](#11-dependencias)
12. [Integraciones Pendientes / Notas para Flutter](#12-integraciones-pendientes--notas-para-flutter)

---

## 1. Visión General

NIMBUS API 2.0 es una API REST que da soporte al sistema de gestión de **paredes de escalada indoor**. Permite:

- CRUD completo de rutas de escalada (vías y bloques)
- Gestión de fotos de pared (upload, descarga, listado, borrado)
- Configuración de layouts LED sobre fotos de pared
- Distribución de APK con rotación automática de versiones
- Búsqueda por autor/nombre dentro de una pared

**No existe ningún sistema de autenticación implementado.** Todos los endpoints son públicos. Esto es el principal gap a cubrir para orquestar un sistema de usuarios.

---

## 2. Infraestructura & Deploy

### Docker Compose

| Servicio     | Imagen           | Puerto interno | Puerto externo | Notas                       |
|--------------|------------------|---------------|----------------|-----------------------------|
| Node/Express | Dockerfile local | 3000          | 3000           | Reinicia salvo parada manual|
| MongoDB      | mongo:6.0.5      | 3010          | 3011           | DB: `NIMBUS`                |

**Volúmenes montados (Node):**

| Ruta host     | Ruta contenedor | Uso             |
|---------------|-----------------|-----------------|
| `./`          | `/usr/app`      | Código fuente   |
| `./apks`      | `/usr/app/apks` | APKs subidos    |
| `./fotos`     | `/usr/app/fotos`| Fotos subidas   |

### Comandos

```bash
make up    # npm install + docker-compose up -d
make down  # docker-compose down -v
npm test   # jest --runInBand
```

### Dockerfile (resumen)

```dockerfile
FROM node:lts-alpine
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
```

---

## 3. Base de Datos

**Motor:** MongoDB 6.0.5  
**Nombre de BD:** `NIMBUS`  
**URI (dentro de Docker):** `mongodb://mongo:3010/NIMBUS`  
**URI (externa/scripts):** `mongodb://localhost:3011/NIMBUS`

**ORM:** Mongoose 6.9.1 con `strict: true`

---

## 4. Modelos de Datos

### 4.1 `Bloques_Vias` — Rutas de Escalada

**Colección:** `Bloques_Vias`

| Campo         | Tipo      | Requerido | Default | Descripción                          |
|---------------|-----------|-----------|---------|--------------------------------------|
| `name`        | String    | ✅        | —       | Nombre de la vía/bloque              |
| `autor`       | String    | ✅        | —       | Creador de la ruta                   |
| `dificultad`  | Number    | ❌        | —       | Nivel numérico de dificultad         |
| `comentario`  | String    | ❌        | texto   | Descripción / método de escalada     |
| `presas`      | [String]  | ❌        | —       | Array de colores/identificadores de presas |
| `quepared`    | String    | ✅        | —       | Identificador de pared (ej: `"15"`, `"25"`) |
| `isbloque`    | String    | ✅        | —       | Tipo: `"bloque"` o `"travesia"`      |
| `dateCreation`| Date      | ❌        | —       | Fecha de creación manual             |
| `isVerified`  | Boolean   | ❌        | `false` | Si el routesetter está verificado    |

---

### 4.2 `Foto` — Metadatos de Imágenes

**Colección:** `Fotos`

| Campo             | Tipo   | Requerido | Default      | Descripción                          |
|-------------------|--------|-----------|--------------|--------------------------------------|
| `quepared`        | String | ✅        | —            | Pared a la que pertenece             |
| `nombre_original` | String | ✅        | —            | Nombre original del archivo          |
| `nombre_guardado` | String | ✅        | —            | Nombre con el que se guarda (único)  |
| `tamano_bytes`    | Number | ✅        | —            | Tamaño del fichero en bytes          |
| `ruta_interna`    | String | ✅        | —            | Path interno del servidor            |
| `url_publica`     | String | ✅        | —            | URL pública accesible                |
| `dateCreation`    | Date   | ❌        | `Date.now()` | Fecha de subida                      |

---

### 4.3 `Layout` — Configuración LED

**Colección:** `layouts`

| Campo              | Tipo       | Requerido | Default | Descripción                              |
|--------------------|------------|-----------|---------|------------------------------------------|
| `quepared`         | String     | ✅        | —       | Pared asociada                           |
| `name`             | String     | ✅        | —       | Nombre del layout                        |
| `ledCount`         | Number     | ✅        | —       | Total de LEDs                            |
| `baseWidth`        | Number     | ✅        | —       | Ancho de pared (px)                      |
| `baseHeight`       | Number     | ✅        | —       | Alto de pared (px)                       |
| `defaultHoldSize`  | Number     | ❌        | `36`    | Tamaño de presa por defecto (px)         |
| `holds`            | [Hold]     | ❌        | `[]`    | Array de presas con posición LED         |
| `foto_id`          | ObjectId   | ✅        | —       | Referencia a `Fotos._id`                 |
| `foto_url_publica` | String     | ✅        | —       | URL pública cacheada de la foto          |
| `createdAt`        | Date       | auto      | —       | Timestamps automáticos (Mongoose)        |
| `updatedAt`        | Date       | auto      | —       | Timestamps automáticos (Mongoose)        |

**Sub-esquema Hold:**

| Campo  | Tipo   | Requerido | Descripción                    |
|--------|--------|-----------|--------------------------------|
| `led`  | Number | ✅        | ID del LED                     |
| `x`    | Number | ✅        | Coordenada X                   |
| `y`    | Number | ✅        | Coordenada Y                   |
| `size` | Number | ❌        | Override de tamaño de presa    |

---

## 5. Endpoints — Referencia Completa

### A. Rutas de Escalada (Vías/Bloques)

---

#### `GET /listar`

Lista rutas con filtros opcionales.

**Query params:**

| Param        | Tipo    | Requerido | Descripción                        |
|--------------|---------|-----------|------------------------------------|
| `quepared`   | string  | ❌        | Filtrar por pared (`"15"`, `"25"`) |
| `dificultad` | number  | ❌        | Filtrar por dificultad exacta      |
| `isbloque`   | string  | ❌        | `"bloque"` o `"travesia"`          |
| `isVerified` | string  | ❌        | `"true"` o `"false"`               |

**Respuesta 200:**
```json
{
  "vias": [
    {
      "_id": "ObjectId",
      "name": "La directa",
      "autor": "Carlos",
      "dificultad": 6,
      "comentario": "...",
      "presas": ["rojo", "azul"],
      "quepared": "15",
      "isbloque": "bloque",
      "dateCreation": "2024-01-15T10:00:00.000Z",
      "isVerified": true
    }
  ]
}
```

---

#### `POST /guardar`

Crea una nueva ruta de escalada.

**Body (JSON):**

| Campo        | Tipo     | Requerido | Descripción              |
|--------------|----------|-----------|--------------------------|
| `name`       | string   | ✅        | Nombre de la vía         |
| `autor`      | string   | ✅        | Autor                    |
| `dificultad` | number   | ❌        | Nivel de dificultad      |
| `comentario` | string   | ❌        | Descripción              |
| `presas`     | string[] | ❌        | Colores/IDs de presas    |
| `quepared`   | string   | ✅        | Identificador de pared   |
| `isbloque`   | string   | ✅        | `"bloque"` o `"travesia"`|

**Respuesta 200:**
```json
{
  "itinerario": { /* documento creado */ },
  "mensaje": "Itinerario creado con exito"
}
```

**Respuesta 400:**
```json
{ "mensaje": "Faltan campos obligatorios" }
```

---

#### `PUT /editar/:id`

Actualiza una ruta existente (actualización parcial).

**URL param:** `id` — MongoDB ObjectId de la ruta

**Body (JSON):** Cualquier campo de `Bloques_Vias` (parcial)

**Respuesta 200:**
```json
{
  "itinerario": { /* documento actualizado */ },
  "mensaje": "Itinerario actualizado con exito"
}
```

---

#### `DELETE /borrar/:id`

Elimina una ruta.

**URL param:** `id` — MongoDB ObjectId

**Respuesta 200:**
```json
{
  "Mensaje": "itinerario eliminado con éxito",
  "articuloBorrado": { /* documento eliminado */ }
}
```

---

#### `GET /buscar`

Búsqueda por texto en `autor` y `name` (regex case-insensitive).

**Query params:**

| Param      | Tipo   | Requerido | Descripción                  |
|------------|--------|-----------|------------------------------|
| `buscar`   | string | ✅        | Término de búsqueda          |
| `quepared` | string | ✅        | Pared donde buscar           |

**Respuesta 200:**
```json
{
  "status": "Éxito, aquí están los resultados de tu búsqueda",
  "vias": [ /* array de rutas */ ]
}
```

---

### B. Fotos

---

#### `POST /subir_foto`

Sube una imagen de pared. Usa `multipart/form-data`.

**Form data:**

| Campo            | Tipo   | Requerido | Descripción                        |
|------------------|--------|-----------|------------------------------------|
| `foto`           | file   | ✅        | Imagen (jpg, jpeg, png, webp, gif) |
| `quepared`       | string | ✅        | Pared asociada                     |
| `nombre_guardado`| string | ✅        | Nombre personalizado (sin ext.)    |

**Límites:** Tamaño máximo 20 MB. Formatos: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

**Validaciones:** No se permiten `nombre_guardado` duplicados.

**Respuesta 200:**
```json
{
  "status": "ok",
  "mensaje": "Imagen subida con exito",
  "foto": {
    "_id": "ObjectId",
    "quepared": "15",
    "nombre_original": "pared_foto.jpg",
    "nombre_guardado": "pared_15_v1",
    "tamano_bytes": 2048000,
    "ruta_interna": "/usr/app/fotos/pared_15_v1.jpg",
    "url_publica": "http://api-main.nimbuswalls.com/descargar_foto?file=pared_15_v1.jpg",
    "dateCreation": "2024-01-15T10:00:00.000Z"
  }
}
```

**Respuesta 400:** Nombre duplicado, tipo inválido, falta archivo o `quepared`

---

#### `GET /listar_fotos/:quepared`

Lista todas las fotos de una pared, ordenadas por fecha (desc).

**URL param:** `quepared` — identificador de pared

**Respuesta 200:**
```json
{
  "status": "ok",
  "total": 3,
  "fotos": [ /* array de documentos Foto */ ]
}
```

---

#### `GET /descargar_foto`

Descarga una imagen por nombre de archivo.

**Query params:**

| Param  | Tipo   | Requerido | Descripción              |
|--------|--------|-----------|--------------------------|
| `file` | string | ✅        | Nombre del archivo (con extensión) |

**Respuesta:** Archivo binario (stream) o error JSON.

**Errores:**
- `400` — `file` no proporcionado
- `404` — Archivo no encontrado
- Maneja abortos de conexión de forma silenciosa

---

#### `DELETE /eliminar_foto/:id`

Elimina una foto de la BD y del sistema de ficheros.

**URL param:** `id` — MongoDB ObjectId del documento `Foto`

**Respuesta 200:**
```json
{
  "status": "ok",
  "mensaje": "Foto y registro eliminados correctamente"
}
```

**Advertencia:** Si un Layout referencia esta foto, la URL cacheada en `foto_url_publica` quedará rota.

---

### C. Layouts LED

---

#### `POST /nuevo_layout`

Crea un layout LED vinculado a una foto existente.

**Body (JSON):**

| Campo             | Tipo     | Requerido | Descripción                    |
|-------------------|----------|-----------|--------------------------------|
| `quepared`        | string   | ✅        | Pared                          |
| `name`            | string   | ✅        | Nombre del layout              |
| `ledCount`        | number   | ✅        | Total de LEDs                  |
| `baseWidth`       | number   | ✅        | Ancho (px)                     |
| `baseHeight`      | number   | ✅        | Alto (px)                      |
| `defaultHoldSize` | number   | ❌        | Tamaño presa por defecto (px)  |
| `holds`           | Hold[]   | ❌        | Array de posiciones de presas  |
| `foto_id`         | ObjectId | ✅        | `_id` de un documento `Fotos`  |

**Validación previa:** Verifica que `foto_id` exista en colección `Fotos`.

**Respuesta 201:**
```json
{
  "status": "ok",
  "mensaje": "Layout creado con exito",
  "layout": { /* documento creado completo */ }
}
```

**Errores:**
- `400` — Campos requeridos faltantes
- `404` — `foto_id` no encontrado en BD
- `500` — Error de servidor

---

#### `GET /listar_layouts/:quepared`

Lista layouts de una pared con datos de foto populados.

**URL param:** `quepared`

**Respuesta 200:**
```json
{
  "status": "ok",
  "total": 2,
  "layouts": [
    {
      "_id": "ObjectId",
      "quepared": "15",
      "name": "Layout Principal",
      "ledCount": 300,
      "baseWidth": 1920,
      "baseHeight": 1080,
      "defaultHoldSize": 36,
      "holds": [
        { "led": 1, "x": 100, "y": 200, "size": 40 }
      ],
      "foto_id": { /* documento Foto populado */ },
      "foto_url_publica": "http://...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

#### `PUT /editar_layout/:id`

Actualiza un layout (parcial). Si se cambia `foto_id`, valida y actualiza `foto_url_publica`.

**URL param:** `id` — ObjectId del layout

**Body (JSON):** Cualquier campo del layout (parcial)

**Respuesta 200:**
```json
{
  "status": "ok",
  "mensaje": "Layout actualizado con exito",
  "layout": { /* documento actualizado */ }
}
```

---

#### `DELETE /eliminar_layout/:id`

Elimina un layout de la BD.

**URL param:** `id` — ObjectId del layout

**Respuesta 200:**
```json
{
  "status": "ok",
  "mensaje": "Layout eliminado con exito",
  "layout_eliminado": { /* documento eliminado */ }
}
```

---

### D. APK Distribution

---

#### `POST /subir_apk`

Sube un APK nuevo. Activa el sistema de rotación de versiones.

**Form data:**

| Campo | Tipo | Requerido | Descripción          |
|-------|------|-----------|----------------------|
| `apk` | file | ✅        | Archivo `.apk` únicamente |

**Límite:** 200 MB máximo.

**Sistema de rotación automático:**

```
Upload nuevo APK
  → Se guarda como: nimbus_apk_latest_server.apk
  → anterior latest  → nimbus_apk_n-1.apk
  → anterior n-1     → nimbus_apk_n-2.apk
  → anterior n-2     → nimbus_apk_n-3.apk
  → anterior n-3     → ELIMINADO
```

**Respuesta 200:**
```json
{
  "status": "ok",
  "mensaje": "APK subida con exito",
  "nombre_original": "nimbus_v2.3.apk",
  "tamano_bytes": 45000000,
  "archivos_resultantes": {
    "latest": "nimbus_apk_latest_server.apk",
    "n-1": "nimbus_apk_n-1.apk",
    "n-2": "nimbus_apk_n-2.apk",
    "n-3": "nimbus_apk_n-3.apk"
  }
}
```

---

#### `GET /descargar`

Descarga un APK por versión o nombre.

**Query params (todos opcionales):**

| Param     | Tipo   | Descripción                                |
|-----------|--------|--------------------------------------------|
| `file`    | string | Nombre de archivo específico               |
| `version` | string | `"latest"` (default), `"1"`, `"2"`, `"3"` |

**Comportamiento por defecto (sin parámetros):** Descarga `nimbus_apk_latest_server.apk`

**Respuesta:** Archivo APK binario (stream).

**Errores:**
- `404` — Versión/archivo no encontrado
- Maneja abortos de conexión silenciosamente

---

### E. Utilidades

---

#### `GET /end`

⚠️ **Endpoint de desarrollo.** Rellena `dateCreation` en todos los documentos `Bloques_Vias` con fechas generadas desde 2022. **Modifica todos los registros.**

**Respuesta 200:**
```json
{ "bloquess": [ /* todos los documentos actualizados */ ] }
```

---

## 6. Flujos de Datos Clave

### Flujo: Crear y configurar una ruta con LED

```
1. POST /subir_foto          → Obtener foto._id y foto.url_publica
2. POST /nuevo_layout        → Crear layout con foto_id (del paso 1)
3. POST /guardar             → Crear ruta (quepared + isbloque + presas)
4. GET  /listar?quepared=X   → Confirmar ruta creada
```

### Flujo: Descarga de APK en Flutter

```
1. GET /descargar?version=latest   → Descarga APK más reciente
   — o —
   GET /descargar?version=1        → APK anterior (n-1)
   GET /descargar?version=2        → APK anterior (n-2)
   GET /descargar?version=3        → APK anterior (n-3)
```

### Flujo: Visualizar pared completa en Flutter

```
1. GET /listar_fotos/:quepared     → Listar fotos de la pared
2. GET /listar_layouts/:quepared   → Obtener layouts con posiciones LED
3. GET /listar?quepared=X          → Obtener todas las rutas activas
4. GET /descargar_foto?file=X.jpg  → Descargar imagen de fondo
```

### Flujo: Búsqueda de rutas

```
GET /buscar?quepared=15&buscar=carlos
  → Retorna vías cuyo name o autor coincidan (regex, case-insensitive)
```

---

## 7. Autenticación & Seguridad

### Estado actual

| Aspecto              | Estado              |
|----------------------|---------------------|
| Autenticación        | ❌ No implementada  |
| Autorización         | ❌ No implementada  |
| API Keys             | ❌ No implementadas |
| JWT / Sessions       | ❌ No implementados |
| Rate limiting        | ❌ No implementado  |
| CORS                 | ✅ Habilitado (todas las origenes) |
| Validación de tipos  | ✅ Multer (archivos) |
| Validación de schema | ✅ Mongoose strict  |

### Gaps para sistema de usuarios (Flutter)

Para integrar un sistema de usuarios completo se requiere implementar en la API:

1. **Modelo `Usuario`** — campos mínimos: `email`, `password` (bcrypt), `rol` (`admin`/`routesetter`/`cliente`), `quepared` (paredes a las que tiene acceso)
2. **Endpoints de auth:**
   - `POST /auth/register`
   - `POST /auth/login` → emite JWT
   - `POST /auth/refresh`
   - `POST /auth/logout`
3. **Middleware JWT** — proteger todos los endpoints de escritura (`POST /guardar`, `PUT /editar`, `DELETE /borrar`, `POST /subir_foto`, `POST /subir_apk`, etc.)
4. **Control por `quepared`** — los usuarios solo deberían ver/modificar las paredes a las que están asignados

---

## 8. Archivos & Almacenamiento

### Fotos

| Detalle          | Valor                           |
|------------------|---------------------------------|
| Ruta en servidor | `/usr/app/fotos/`               |
| Formatos aceptados | jpg, jpeg, png, webp, gif     |
| Tamaño máximo    | 20 MB                           |
| Nomenclatura     | `nombre_guardado` + extensión original |
| URL de descarga  | `GET /descargar_foto?file=<nombre_guardado.ext>` |
| Duplicados       | Rechazados (validación en BD por `nombre_guardado`) |

### APKs

| Detalle          | Valor                              |
|------------------|------------------------------------|
| Ruta en servidor | `/usr/app/apks/`                   |
| Formatos aceptados | `.apk` únicamente                |
| Tamaño máximo    | 200 MB                             |
| Versiones guardadas | 4 (latest, n-1, n-2, n-3)      |
| Nombres de archivo | `nimbus_apk_latest_server.apk`, `nimbus_apk_n-1.apk`, etc. |

---

## 9. Scripts de Mantenimiento

### `scripts/verify_autores.js`

Marca como `isVerified: true` los documentos cuyos autores coincidan con una lista predefinida ("esau", "minion").

```bash
MONGO_URI=mongodb://localhost:3011/NIMBUS node scripts/verify_autores.js
```

---

### `scripts/merge_vias.js`

Importa rutas desde un JSON exportado de otra instancia MongoDB. Evita duplicados por `(name + quepared)`.

```bash
node scripts/merge_vias.js scripts/Bloques_vias.json
```

Soporta formato JSON array y JSONL. Convierte tipos extendidos de MongoDB (`$oid`, `$date`).

---

### `scripts/sync_fotos.js`

Sincroniza fotos entre servidor remoto y local. Compara BD vs filesystem y descarga las que faltan.

```bash
node scripts/sync_fotos.js
```

URI remota base: `http://api-main.nimbuswalls.com`

---

## 10. Estructura del Proyecto

```
NIMBUS_API_2.0/
├── index.js                          # Entry point — Puerto 3000
├── package.json
├── docker-compose.yml
├── Dockerfile
├── swagger.json                      # Spec OpenAPI (parcialmente actualizado)
├── Makefile
│
├── apks/                             # Volumen Docker — APKs
├── fotos/                            # Volumen Docker — Imágenes
│
├── src/
│   ├── app.js                        # Express app, middlewares, rutas montadas
│   ├── conexion.js                   # Conexión MongoDB (mongoose)
│   │
│   ├── models/
│   │   ├── Bloques_vias.js          # Schema rutas de escalada
│   │   ├── Foto.js                  # Schema metadatos fotos
│   │   └── layouts.js               # Schema layouts LED
│   │
│   ├── controllers/
│   │   ├── listar.js
│   │   ├── guardar.js
│   │   ├── editar.js
│   │   ├── borrar.js
│   │   ├── buscar.js
│   │   ├── subir_foto.js
│   │   ├── descargar_foto.js
│   │   ├── listar_fotos.js
│   │   ├── eliminar_foto.js
│   │   ├── nuevo_layout.js
│   │   ├── listar_layouts.js
│   │   ├── editar_layout.js
│   │   ├── eliminar_layout.js
│   │   ├── subir_apk.js
│   │   ├── descargar_apk.js
│   │   ├── convertir_dificultad.js  # Deprecado — mapeo color↔dificultad
│   │   └── rellenar_fechas/
│   │       ├── endpoint.js          # Endpoint /end (dev only)
│   │       └── yearfunction.js      # Generador de fechas
│   │
│   └── routes/
│       ├── listar.js · guardar.js · editar.js · borrar.js · buscar.js
│       ├── subir_foto.js · descargar_foto.js · listar_fotos.js · eliminar_foto.js
│       ├── nuevo_layout.js · listar_layouts.js · editar_layout.js · eliminar_layout.js
│       ├── subir_apk.js · descargar_apk.js
│       └── endpoint.js
│
├── scripts/
│   ├── verify_autores.js
│   ├── merge_vias.js
│   ├── sync_fotos.js
│   └── Bloques_vias.json            # Dataset de ejemplo/migración
│
└── specs/
    └── endpoints/
        ├── listar.test.js
        ├── guardar.test.js
        ├── editar.test.js
        ├── borrar.test.js
        └── buscar.test.js
```

---

## 11. Dependencias

### Producción

| Paquete              | Versión | Uso                              |
|----------------------|---------|----------------------------------|
| `express`            | 4.18.2  | Framework HTTP                   |
| `mongoose`           | 6.9.1   | ODM MongoDB                      |
| `multer`             | 2.0.2   | Upload de archivos               |
| `cors`               | 2.8.5   | Cross-Origin Resource Sharing    |
| `validator`          | 13.9.0  | Validación de datos              |
| `swagger-ui-express` | 4.6.2   | UI de documentación              |
| `swagger-jsdoc`      | 6.2.8   | Generación de spec OpenAPI       |

### Desarrollo / Testing

| Paquete       | Versión | Uso                            |
|---------------|---------|--------------------------------|
| `jest`        | 29.4.3  | Framework de tests             |
| `supertest`   | 6.3.3   | Testing de endpoints HTTP      |
| `nodemon`     | 2.0.20  | Auto-reload en desarrollo      |
| `cross-env`   | 7.0.3   | Variables de entorno cross-platform |

---

## 12. Integraciones Pendientes / Notas para Flutter

### Consideraciones de integración Flutter ↔ API

#### Autenticación (no existe — implementar)

La API no tiene ningún sistema de auth. Para un sistema de usuarios funcional con Flutter se necesita:

```
POST /auth/login   → { email, password } → { token: JWT, refreshToken, user: {...} }
POST /auth/register → { email, password, name, rol, quepared[] }
Header en cada request protegido: Authorization: Bearer <JWT>
```

#### Descarga de fotos en Flutter

```dart
// Construir URL de foto
final url = 'http://api-main.nimbuswalls.com/descargar_foto?file=$nombreGuardado';
// Usar CachedNetworkImage o Image.network
```

#### Descarga de APK en Flutter (auto-update)

```dart
// Verificar versión disponible antes de descargar
GET /descargar?version=latest   // Descarga directa del binario
// Guardar en directorio de la app, luego instalar con open_filex
```

#### Filtros recomendados para Flutter UI

- **Por pared:** `GET /listar?quepared=15` — separar paredes en tabs
- **Por tipo:** `GET /listar?isbloque=bloque` vs `isbloque=travesia`
- **Por verificación:** `GET /listar?isVerified=true`
- **Búsqueda en tiempo real:** `GET /buscar?quepared=15&buscar={input}`

#### Manejo de `quepared`

Actualmente es un `String` libre (ej: `"15"`, `"25"`). Para el sistema de usuarios, conviene estandarizar los valores en un enum o en una colección `Paredes` separada.

#### Códigos de error esperados

| Código | Significado                         |
|--------|-------------------------------------|
| 200    | OK (incluso en creaciones)          |
| 201    | Creado (layouts únicamente)         |
| 400    | Validación / parámetros incorrectos |
| 404    | Recurso no encontrado               |
| 500    | Error interno de servidor           |

#### Variables de entorno que conviene externalizar

Actualmente todo está hardcodeado. Para producción es recomendable mover a `.env`:

```env
PORT=3000
MONGO_URI=mongodb://mongo:3010/NIMBUS
BASE_URL=http://api-main.nimbuswalls.com
FOTOS_PATH=/usr/app/fotos
APKS_PATH=/usr/app/apks
JWT_SECRET=...          # (pendiente de implementar)
```

---

*Generado el 2026-06-03 — NIMBUS API 2.0*
