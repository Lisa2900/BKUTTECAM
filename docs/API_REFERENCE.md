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
    "textos": "/api/textos"
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