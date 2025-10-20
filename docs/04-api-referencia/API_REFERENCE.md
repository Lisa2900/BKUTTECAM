# API Reference - UTTECAM

## Authentication
Esta API actualmente **no requiere autenticación**. Todos los endpoints son públicos.

## Base URL
```
http://localhost:3000
```

## Content Type
Todos los requests que envían datos deben usar:
```
Content-Type: application/json
```

## Rate Limiting
Actualmente **no hay límites de rate**, pero se recomienda no realizar más de 100 requests por minuto.

---

## Endpoints

### GET /

Obtiene información básica de la API.

**Response**
```json
{
  "mensaje": "API UTTECAM operativa",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "textos": "/api/textos",
    "nosotros": "/api/nosotros",
    "directorios": "/api/directorios"
  }
}
```

---

### GET /health

Health check del sistema y base de datos.

**Response**
```json
{
  "status": "OK",
  "timestamp": "2025-09-25T10:30:00.000Z",
  "uptime": 3600,
  "database": "connected"
}
```

**Status Codes**
- `200`: Sistema operativo
- `500`: Error del sistema

---

### GET /api/textos

Obtiene lista de todos los textos.

**Response**
```json
[
  {
    "id": 1,
    "contenido": "Texto de ejemplo",
    "created_at": "2025-09-25T10:00:00.000Z",
    "updated_at": "2025-09-25T10:00:00.000Z"
  }
]
```

**Status Codes**
- `200`: Éxito
- `500`: Error del servidor

---

### GET /api/textos/:id

Obtiene un texto específico por ID.

**Parameters**
- `id` (integer, required): ID del texto

**Response Success (200)**
```json
{
  "id": 1,
  "contenido": "Texto específico",
  "created_at": "2025-09-25T10:00:00.000Z",
  "updated_at": "2025-09-25T10:00:00.000Z"
}
```

**Response Error (404)**
```json
{
  "error": "No encontrado"
}
```

**Response Error (400)**
```json
{
  "error": "ID inválido"
}
```

**Status Codes**
- `200`: Texto encontrado
- `400`: ID inválido
- `404`: Texto no encontrado
- `500`: Error del servidor

---

### POST /api/textos

Crea un nuevo texto.

**Request Body**
```json
{
  "contenido": "Nuevo texto a crear"
}
```

**Response Success (201)**
```json
{
  "id": 3,
  "contenido": "Nuevo texto a crear",
  "created_at": "2025-09-25T11:00:00.000Z",
  "updated_at": "2025-09-25T11:00:00.000Z"
}
```

**Response Error (400)**
```json
{
  "error": "contenido requerido (string no vacío)"
}
```

**Validation Rules**
- `contenido`: String requerido, no vacío después de trim()

**Status Codes**
- `201`: Texto creado exitosamente
- `400`: Datos inválidos
- `500`: Error del servidor

---

### PUT /api/textos/:id

Actualiza un texto existente.

**Parameters**
- `id` (integer, required): ID del texto a actualizar

**Request Body**
```json
{
  "contenido": "Contenido actualizado"
}
```

**Response Success (200)**
```json
{
  "id": 1,
  "contenido": "Contenido actualizado"
}
```

**Response Error (404)**
```json
{
  "error": "No encontrado"
}
```

**Response Error (400)**
```json
{
  "error": "contenido requerido"
}
```

**Validation Rules**
- `id`: Número entero válido
- `contenido`: String requerido, no vacío después de trim()

**Status Codes**
- `200`: Texto actualizado
- `400`: ID o datos inválidos
- `404`: Texto no encontrado
- `500`: Error del servidor

---

### DELETE /api/textos/:id

Elimina un texto existente.

**Parameters**
- `id` (integer, required): ID del texto a eliminar

**Response Success (204)**
Sin contenido en el body.

**Response Error (404)**
```json
{
  "error": "No encontrado"
}
```

**Response Error (400)**
```json
{
  "error": "ID inválido"
}
```

**Status Codes**
- `204`: Texto eliminado exitosamente
- `400`: ID inválido
- `404`: Texto no encontrado
- `500`: Error del servidor

---

## Error Handling

Todos los errores siguen el mismo formato:

```json
{
  "error": "Descripción del error"
}
```

### Common Error Responses

**400 Bad Request**
```json
{
  "error": "ID inválido"
}
```

**404 Not Found**
```json
{
  "error": "No encontrado"
}
```

**500 Internal Server Error**
```json
{
  "error": "Error interno del servidor",
  "message": "Detalles técnicos del error"
}
```

---

## Examples

### JavaScript/Fetch
```javascript
// Obtener todos los textos
fetch('http://localhost:3000/api/textos')
  .then(response => response.json())
  .then(data => console.log(data));

// Crear nuevo texto
fetch('http://localhost:3000/api/textos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    contenido: 'Mi nuevo texto'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Python/Requests
```python
import requests

# Obtener todos los textos
response = requests.get('http://localhost:3000/api/textos')
print(response.json())

# Crear nuevo texto
data = {'contenido': 'Mi nuevo texto'}
response = requests.post(
    'http://localhost:3000/api/textos',
    json=data
)
print(response.json())
```

### PHP/cURL
```php
// Obtener todos los textos
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:3000/api/textos');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;

// Crear nuevo texto
$data = json_encode(['contenido' => 'Mi nuevo texto']);
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:3000/api/textos');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;
```

---

## Directorios API

El módulo de directorios gestiona la información del personal y estructura organizacional de la universidad.

### GET /api/directorios

Obtiene todos los directorios registrados.

**Response Success (200)**
```json
{
  "message": "Directorios obtenidos correctamente",
  "data": [
    {
      "id": 1,
      "titulo": "Secretaría de Vinculación",
      "nombre": "Mtro. Daniel Huerta Conde",
      "telefono": "2494223300",
      "extension": "120",
      "correo": "vinculacion@uttecam.edu.mx",
      "imagen": "directorio_1696123456789.png"
    },
    {
      "id": 2,
      "titulo": "Encargado de Secretaría Académica",
      "nombre": "Mtro. Carlos Islas Contreras",
      "telefono": "2494223300",
      "extension": "135",
      "correo": "secretariaacademica@uttecam.edu.mx",
      "imagen": "directorio_1696123456790.png"
    }
  ]
}
```

**Status Codes**
- `200`: Directorios obtenidos exitosamente
- `500`: Error del servidor

---

### GET /api/directorios/:id

Obtiene un directorio específico por su ID.

**Parameters**
- `id` (number): ID del directorio

**Response Success (200)**
```json
{
  "message": "Directorio encontrado",
  "data": {
    "id": 1,
    "titulo": "Secretaría de Vinculación",
    "nombre": "Mtro. Daniel Huerta Conde",
    "telefono": "2494223300",
    "extension": "120",
    "correo": "vinculacion@uttecam.edu.mx",
    "imagen": "directorio_1696123456789.png"
  }
}
```

**Response Error (404)**
```json
{
  "message": "Directorio no encontrado"
}
```

**Response Error (400)**
```json
{
  "error": "ID inválido"
}
```

**Status Codes**
- `200`: Directorio encontrado
- `400`: ID inválido
- `404`: Directorio no encontrado
- `500`: Error del servidor

---

### POST /api/directorios

Crea un nuevo directorio. Soporta subida de imagen mediante multipart/form-data.

**Content-Type**: `multipart/form-data`

**Form Fields**
- `titulo` (string, required): Título del cargo (máx. 150 caracteres)
- `nombre` (string, required): Nombre completo de la persona (máx. 150 caracteres)
- `telefono` (string, optional): Número de teléfono (máx. 20 caracteres, solo números)
- `extension` (string, optional): Extensión telefónica (máx. 10 caracteres, solo números)
- `correo` (string, optional): Correo electrónico (máx. 150 caracteres, formato email válido)
- `imagen` (file, optional): Imagen del directorio (formatos: jpeg, jpg, png, gif, webp, avif, svg | máx. 5MB)

**Response Success (201)**
```json
{
  "message": "Directorio creado correctamente",
  "data": {
    "id": 3,
    "titulo": "Director de Tecnologías",
    "nombre": "Ing. Ana García López",
    "telefono": "2494223300",
    "extension": "140",
    "correo": "tecnologias@uttecam.edu.mx",
    "imagen": "directorio_1696123456791.png"
  }
}
```

**Response Error (400) - Campos requeridos**
```json
{
  "error": "Título y nombre son campos requeridos"
}
```

**Response Error (400) - Validación**
```json
{
  "error": "Error de validación",
  "details": [
    {
      "field": "correo",
      "message": "Debe ser un correo electrónico válido"
    },
    {
      "field": "telefono",
      "message": "El teléfono debe contener solo números"
    }
  ]
}
```

**Status Codes**
- `201`: Directorio creado exitosamente
- `400`: Error de validación o campos requeridos faltantes
- `500`: Error del servidor

---

### PUT /api/directorios/:id

Actualiza un directorio existente. Soporta subida de imagen mediante multipart/form-data.

**Parameters**
- `id` (number): ID del directorio a actualizar

**Content-Type**: `multipart/form-data`

**Form Fields**
- `titulo` (string, required): Título del cargo (máx. 150 caracteres)
- `nombre` (string, required): Nombre completo de la persona (máx. 150 caracteres)
- `telefono` (string, optional): Número de teléfono (máx. 20 caracteres, solo números)
- `extension` (string, optional): Extensión telefónica (máx. 10 caracteres, solo números)
- `correo` (string, optional): Correo electrónico (máx. 150 caracteres, formato email válido)
- `imagen` (file, optional): Nueva imagen del directorio (formatos: jpeg, jpg, png, gif, webp, avif, svg | máx. 5MB)

**Response Success (200)**
```json
{
  "message": "Directorio actualizado correctamente",
  "data": {
    "id": 1,
    "titulo": "Secretaría de Vinculación Empresarial",
    "nombre": "Mtro. Daniel Huerta Conde",
    "telefono": "2494223300",
    "extension": "120",
    "correo": "vinculacion@uttecam.edu.mx",
    "imagen": "directorio_1696123456792.png"
  }
}
```

**Response Error (400) - ID inválido**
```json
{
  "error": "ID inválido"
}
```

**Response Error (404)**
```json
{
  "message": "Directorio no encontrado"
}
```

**Response Error (400) - Validación**
```json
{
  "error": "Error de validación",
  "details": [
    {
      "field": "titulo",
      "message": "El título debe tener entre 1 y 150 caracteres"
    }
  ]
}
```

**Status Codes**
- `200`: Directorio actualizado exitosamente
- `400`: Error de validación, ID inválido o campos requeridos faltantes
- `404`: Directorio no encontrado
- `500`: Error del servidor

---

### DELETE /api/directorios/:id

Elimina un directorio específico.

**Parameters**
- `id` (number): ID del directorio a eliminar

**Response Success (200)**
```json
{
  "message": "Directorio eliminado correctamente",
  "data": {
    "id": 1
  }
}
```

**Response Error (400)**
```json
{
  "error": "ID inválido"
}
```

**Response Error (404)**
```json
{
  "message": "Directorio no encontrado"
}
```

**Status Codes**
- `200`: Directorio eliminado exitosamente
- `400`: ID inválido
- `404`: Directorio no encontrado
- `500`: Error del servidor

---

## Directorios - Ejemplos de Uso

### JavaScript/Fetch - Obtener todos los directorios
```javascript
fetch('http://localhost:3000/api/directorios')
  .then(response => response.json())
  .then(data => console.log(data));
```

### JavaScript/Fetch - Crear directorio con imagen
```javascript
const formData = new FormData();
formData.append('titulo', 'Director de Innovación');
formData.append('nombre', 'Dr. Luis Martínez');
formData.append('telefono', '2494223300');
formData.append('extension', '150');
formData.append('correo', 'innovacion@uttecam.edu.mx');
formData.append('imagen', fileInput.files[0]); // archivo de input file

fetch('http://localhost:3000/api/directorios', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

### JavaScript/Fetch - Actualizar directorio
```javascript
const formData = new FormData();
formData.append('titulo', 'Secretaría de Vinculación Empresarial');
formData.append('nombre', 'Mtro. Daniel Huerta Conde');
formData.append('telefono', '2494223300');
formData.append('extension', '120');
formData.append('correo', 'vinculacion@uttecam.edu.mx');

fetch('http://localhost:3000/api/directorios/1', {
  method: 'PUT',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

### cURL - Crear directorio con imagen
```bash
curl -X POST http://localhost:3000/api/directorios \
  -F "titulo=Director de Sistemas" \
  -F "nombre=Ing. María González" \
  -F "telefono=2494223300" \
  -F "extension=160" \
  -F "correo=sistemas@uttecam.edu.mx" \
  -F "imagen=@/ruta/a/imagen.jpg"
```

### cURL - Obtener directorio específico
```bash
curl -X GET http://localhost:3000/api/directorios/1
```

### cURL - Eliminar directorio
```bash
curl -X DELETE http://localhost:3000/api/directorios/1
```

---

## Nosotros API

El módulo de **Nosotros** gestiona el contenido institucional de la universidad (visión, misión, valores, historia, etc.) con soporte para imágenes.

### GET /api/nosotros/contenido

Obtiene todo el contenido institucional.

**Response Success (200)**
```json
{
  "message": "Contenido obtenido correctamente",
  "count": 4,
  "data": [
    {
      "id": 1,
      "tipo": "vision",
      "titulo": "Nuestra Visión",
      "descripcion": "Ser una institución líder en educación tecnológica...",
      "imagen": "nosotros/vision_1727486365123.jpg",
      "imageUrl": "/uploads/nosotros/vision_1727486365123.jpg",
      "lista": null,
      "fechaCreacion": "2025-10-01T10:00:00.000Z",
      "fechaActualizacion": "2025-10-01T10:00:00.000Z"
    },
    {
      "id": 2,
      "tipo": "mision",
      "titulo": "Nuestra Misión",
      "descripcion": "Formar profesionales con excelencia académica...",
      "imagen": "nosotros/mision_1727486365124.png",
      "imageUrl": "/uploads/nosotros/mision_1727486365124.png",
      "lista": null,
      "fechaCreacion": "2025-10-01T10:05:00.000Z",
      "fechaActualizacion": "2025-10-01T10:05:00.000Z"
    },
    {
      "id": 3,
      "tipo": "valores",
      "titulo": "Nuestros Valores",
      "descripcion": "Los valores que nos guían como institución",
      "imagen": "nosotros/valores_1727486365125.webp",
      "imageUrl": "/uploads/nosotros/valores_1727486365125.webp",
      "lista": ["Excelencia", "Integridad", "Responsabilidad", "Innovación"],
      "fechaCreacion": "2025-10-01T10:10:00.000Z",
      "fechaActualizacion": "2025-10-01T10:10:00.000Z"
    }
  ]
}
```

**Status Codes**
- `200`: Contenido obtenido exitosamente
- `500`: Error del servidor

---

### GET /api/nosotros/contenido/:id

Obtiene un contenido específico por su ID.

**Parameters**
- `id` (number): ID del contenido

**Response Success (200)**
```json
{
  "message": "Contenido encontrado",
  "data": {
    "id": 1,
    "tipo": "vision",
    "titulo": "Nuestra Visión",
    "descripcion": "Ser una institución líder en educación tecnológica...",
    "imagen": "nosotros/vision_1727486365123.jpg",
    "imageUrl": "/uploads/nosotros/vision_1727486365123.jpg",
    "lista": null,
    "fechaCreacion": "2025-10-01T10:00:00.000Z",
    "fechaActualizacion": "2025-10-01T10:00:00.000Z"
  }
}
```

**Response Error (404)**
```json
{
  "message": "Contenido no encontrado"
}
```

**Response Error (400)**
```json
{
  "error": "ID inválido"
}
```

**Status Codes**
- `200`: Contenido encontrado
- `400`: ID inválido
- `404`: Contenido no encontrado
- `500`: Error del servidor

---

### GET /api/nosotros/contenido/tipo/:tipo

Obtiene contenido filtrado por tipo.

**Parameters**
- `tipo` (string): Tipo de contenido (vision, mision, valores, historia, etc.)

**Response Success (200)**
```json
{
  "message": "Contenido obtenido correctamente",
  "count": 1,
  "data": [
    {
      "id": 1,
      "tipo": "vision",
      "titulo": "Nuestra Visión",
      "descripcion": "Ser una institución líder...",
      "imagen": "nosotros/vision_1727486365123.jpg",
      "imageUrl": "/uploads/nosotros/vision_1727486365123.jpg",
      "lista": null,
      "fechaCreacion": "2025-10-01T10:00:00.000Z",
      "fechaActualizacion": "2025-10-01T10:00:00.000Z"
    }
  ]
}
```

**Response Error (404)**
```json
{
  "message": "No se encontró contenido del tipo especificado"
}
```

**Status Codes**
- `200`: Contenido encontrado
- `404`: No se encontró contenido de ese tipo
- `500`: Error del servidor

---

### POST /api/nosotros/contenido

Crea nuevo contenido institucional. Soporta subida de imagen mediante multipart/form-data.

**Content-Type**: `multipart/form-data`

**Form Fields**
- `tipo` (string, required): Tipo de contenido (vision, mision, valores, historia, etc.) (máx. 50 caracteres)
- `titulo` (string, required): Título del contenido (máx. 200 caracteres)
- `descripcion` (text, optional): Descripción detallada del contenido
- `imagen` (file, optional): Imagen asociada (formatos: jpeg, jpg, png, gif, webp, avif, svg | máx. 5MB)
- `lista` (array, optional): Array de elementos JSON para contenido tipo lista

**Response Success (201)**
```json
{
  "message": "Contenido creado correctamente",
  "data": {
    "id": 4,
    "tipo": "historia",
    "titulo": "Nuestra Historia",
    "descripcion": "Fundada en 1991, la UTTECAM ha sido...",
    "imagen": "nosotros/historia_1727486365126.jpg",
    "imageUrl": "/uploads/nosotros/historia_1727486365126.jpg",
    "lista": null,
    "fechaCreacion": "2025-10-06T15:30:00.000Z",
    "fechaActualizacion": "2025-10-06T15:30:00.000Z"
  }
}
```

**Response Error (400) - Campos requeridos**
```json
{
  "error": "Tipo y título son campos requeridos"
}
```

**Response Error (400) - Validación**
```json
{
  "error": "Error de validación",
  "details": [
    {
      "field": "tipo",
      "message": "El tipo debe tener entre 1 y 50 caracteres"
    }
  ]
}
```

**Response Error (400) - Imagen inválida**
```json
{
  "error": "Solo se permiten imágenes (jpeg, jpg, png, gif, webp, avif, svg)"
}
```

**Status Codes**
- `201`: Contenido creado exitosamente
- `400`: Error de validación o campos requeridos faltantes
- `500`: Error del servidor

---

### PUT /api/nosotros/contenido/:id

Actualiza contenido institucional existente. Soporta subida de nueva imagen mediante multipart/form-data.

**Parameters**
- `id` (number): ID del contenido a actualizar

**Content-Type**: `multipart/form-data`

**Form Fields**
- `tipo` (string, optional): Tipo de contenido (máx. 50 caracteres)
- `titulo` (string, optional): Título del contenido (máx. 200 caracteres)
- `descripcion` (text, optional): Descripción detallada del contenido
- `imagen` (file, optional): Nueva imagen (reemplaza la anterior | formatos: jpeg, jpg, png, gif, webp, avif, svg | máx. 5MB)
- `lista` (array, optional): Array de elementos JSON

**Response Success (200)**
```json
{
  "message": "Contenido actualizado correctamente",
  "data": {
    "id": 1,
    "tipo": "vision",
    "titulo": "Nuestra Visión Actualizada",
    "descripcion": "Ser una institución líder en educación tecnológica y formación integral...",
    "imagen": "nosotros/vision_1727486365127.png",
    "imageUrl": "/uploads/nosotros/vision_1727486365127.png",
    "lista": null,
    "fechaCreacion": "2025-10-01T10:00:00.000Z",
    "fechaActualizacion": "2025-10-06T16:00:00.000Z"
  }
}
```

**Response Error (400) - ID inválido**
```json
{
  "error": "ID inválido"
}
```

**Response Error (404)**
```json
{
  "message": "Contenido no encontrado"
}
```

**Response Error (400) - Validación**
```json
{
  "error": "Error de validación",
  "details": [
    {
      "field": "titulo",
      "message": "El título debe tener entre 1 y 200 caracteres"
    }
  ]
}
```

**Status Codes**
- `200`: Contenido actualizado exitosamente
- `400`: Error de validación o ID inválido
- `404`: Contenido no encontrado
- `500`: Error del servidor

---

### DELETE /api/nosotros/contenido/:id

Elimina un contenido institucional específico. También elimina automáticamente la imagen asociada.

**Parameters**
- `id` (number): ID del contenido a eliminar

**Response Success (200)**
```json
{
  "message": "Contenido eliminado correctamente",
  "data": {
    "id": 1
  }
}
```

**Response Error (400)**
```json
{
  "error": "ID inválido"
}
```

**Response Error (404)**
```json
{
  "message": "Contenido no encontrado"
}
```

**Status Codes**
- `200`: Contenido eliminado exitosamente
- `400`: ID inválido
- `404`: Contenido no encontrado
- `500`: Error del servidor

---

## Nosotros - Características de Manejo de Imágenes

### 📸 Sistema de Upload

- **Formatos soportados:** JPEG, JPG, PNG, GIF, WEBP, AVIF, SVG
- **Tamaño máximo:** 5MB por archivo
- **Nomenclatura automática:** `{tipo}_{timestamp}.{extension}`
- **Directorio:** `/uploads/nosotros/`
- **URLs completas:** Generadas automáticamente en el campo `imageUrl`

### 🛡️ Gestión Automática

- ✅ **Eliminación automática** de imágenes al eliminar contenido
- ✅ **Reemplazo automático** al actualizar con nueva imagen
- ✅ **Limpieza en errores** - Rollback automático
- ✅ **Validación de seguridad** - Solo formatos permitidos

### 📁 Acceso a Imágenes

Las imágenes subidas están disponibles públicamente en:
```
http://localhost:3000/uploads/nosotros/{nombre_archivo}
```

---

## Nosotros - Ejemplos de Uso

### JavaScript/Fetch - Obtener todo el contenido
```javascript
fetch('http://localhost:3000/api/nosotros/contenido')
  .then(response => response.json())
  .then(data => console.log(data));
```

### JavaScript/Fetch - Obtener contenido por tipo
```javascript
fetch('http://localhost:3000/api/nosotros/contenido/tipo/vision')
  .then(response => response.json())
  .then(data => console.log(data));
```

### JavaScript/Fetch - Crear contenido con imagen
```javascript
const formData = new FormData();
formData.append('tipo', 'vision');
formData.append('titulo', 'Nuestra Visión');
formData.append('descripcion', 'Ser una institución líder en educación tecnológica...');
formData.append('imagen', fileInput.files[0]); // archivo de input file

fetch('http://localhost:3000/api/nosotros/contenido', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

### JavaScript/Fetch - Crear contenido con lista
```javascript
const formData = new FormData();
formData.append('tipo', 'valores');
formData.append('titulo', 'Nuestros Valores');
formData.append('descripcion', 'Los valores que nos guían');
formData.append('lista', JSON.stringify([
  'Excelencia',
  'Integridad',
  'Responsabilidad',
  'Innovación'
]));
formData.append('imagen', fileInput.files[0]);

fetch('http://localhost:3000/api/nosotros/contenido', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

### JavaScript/Fetch - Actualizar solo texto (mantener imagen)
```javascript
const formData = new FormData();
formData.append('titulo', 'Título Actualizado');
formData.append('descripcion', 'Nueva descripción del contenido');

fetch('http://localhost:3000/api/nosotros/contenido/1', {
  method: 'PUT',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

### JavaScript/Fetch - Actualizar imagen
```javascript
const formData = new FormData();
formData.append('imagen', newFileInput.files[0]); // nueva imagen

fetch('http://localhost:3000/api/nosotros/contenido/1', {
  method: 'PUT',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

### cURL - Crear contenido con imagen
```bash
curl -X POST http://localhost:3000/api/nosotros/contenido \
  -F "tipo=vision" \
  -F "titulo=Nuestra Visión" \
  -F "descripcion=Ser una institución líder en educación tecnológica" \
  -F "imagen=@/ruta/a/tu/imagen.jpg"
```

### cURL - Actualizar solo texto
```bash
curl -X PUT http://localhost:3000/api/nosotros/contenido/1 \
  -F "titulo=Título Actualizado" \
  -F "descripcion=Nueva descripción"
```

### cURL - Obtener contenido específico
```bash
curl -X GET http://localhost:3000/api/nosotros/contenido/1
```

### cURL - Obtener por tipo
```bash
curl -X GET http://localhost:3000/api/nosotros/contenido/tipo/mision
```

### cURL - Eliminar contenido
```bash
curl -X DELETE http://localhost:3000/api/nosotros/contenido/1
```

### PowerShell - Crear contenido
```powershell
# Para archivos en PowerShell, usar herramientas como Postman o crear formularios HTML
$body = @{
    tipo = "vision"
    titulo = "Nuestra Visión"
    descripcion = "Ser una institución líder en educación tecnológica"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/nosotros/contenido" -Method POST -Body $body -ContentType "application/json"
```

---

## Resumen de Endpoints

### Textos
- `GET /api/textos` - Listar textos con paginación
- `GET /api/textos/stats` - Estadísticas
- `GET /api/textos/:id` - Obtener por ID
- `POST /api/textos` - Crear texto
- `PUT /api/textos/:id` - Actualizar texto
- `DELETE /api/textos/:id` - Eliminar texto

### Directorios
- `GET /api/directorios` - Listar directorios
- `GET /api/directorios/:id` - Obtener por ID
- `POST /api/directorios` - Crear directorio (con imagen)
- `PUT /api/directorios/:id` - Actualizar directorio (con imagen)
- `DELETE /api/directorios/:id` - Eliminar directorio

### Nosotros
- `GET /api/nosotros/contenido` - Listar todo el contenido
- `GET /api/nosotros/contenido/:id` - Obtener por ID
- `GET /api/nosotros/contenido/tipo/:tipo` - Obtener por tipo
- `POST /api/nosotros/contenido` - Crear contenido (con imagen)
- `PUT /api/nosotros/contenido/:id` - Actualizar contenido (con imagen)
- `DELETE /api/nosotros/contenido/:id` - Eliminar contenido

---

**API UTTECAM - Documentación Completa v1.0** 📚  
**Última actualización:** Octubre 2025