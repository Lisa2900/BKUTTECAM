# Testing con Jest

Este proyecto usa **Jest** como framework de testing principal, junto con **Supertest** para tests de API HTTP.

## 🚀 Inicio rápido

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests en modo watch (desarrollo)
```bash
npm run test:watch
```

### Ejecutar tests con cobertura
```bash
npm run test:coverage
```

### Ejecutar tests para CI/CD
```bash
npm run test:ci
```

## 📁 Estructura de tests

```
tests/
├── setup.ts                    # Configuración global de Jest
├── health.test.ts             # Tests básicos de health check
├── nosotros-api.test.ts       # Tests de API para "Nosotros"
└── nosotros/                  # Tests legacy (axios)
    ├── nosotros.test.js
    ├── nosotros-validation.test.js
    └── ...
```

## 🛠️ Configuración

### Jest Configuration (`jest.config.js`)
- **Preset**: `ts-jest` para soporte TypeScript
- **Environment**: `node` para tests backend
- **Coverage**: Reportes en texto, HTML y LCOV
- **Setup**: Configuración global en `tests/setup.ts`

### Variables de entorno para tests
```bash
# En .env o .env.test
NODE_ENV=test
JWT_SECRET=test-jwt-secret
TEST_JWT_TOKEN=tu-token-de-prueba
```

## 📝 Escribiendo tests

### Tests de API con Supertest

```typescript
import request from 'supertest';
import app from '../src/app';

describe('Mi API', () => {
  test('GET /endpoint', async () => {
    const response = await request(app)
      .get('/endpoint')
      .expect(200);

    expect(response.body).toHaveProperty('data');
  });

  test('POST /endpoint requiere auth', async () => {
    const response = await request(app)
      .post('/endpoint')
      .set('Authorization', `Bearer ${token}`)
      .send({ data: 'test' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
  });
});
```

### Tests de unidades

```typescript
import { miFuncion } from '../src/utils/miFuncion';

describe('miFuncion', () => {
  test('debería retornar resultado esperado', () => {
    const result = miFuncion('input');
    expect(result).toBe('expected output');
  });

  test('debería manejar errores', () => {
    expect(() => miFuncion(null)).toThrow('Error message');
  });
});
```

## 🔧 Comandos útiles

### Ejecutar tests específicos
```bash
# Un archivo específico
npm test health.test.ts

# Tests que coincidan con patrón
npm test -- --testNamePattern="health"

# Una suite específica
npm test -- --testPathPattern=nosotros
```

### Depuración
```bash
# Ver logs detallados
npm test -- --verbose

# Ejecutar un test específico
npm test -- --testNamePattern="debería obtener contenido"
```

### Cobertura
```bash
# Ver reporte en terminal
npm run test:coverage

# Abrir reporte HTML
open coverage/lcov-report/index.html
```

## 📊 Cobertura de código

Jest genera reportes de cobertura que muestran:
- **Statements**: Líneas ejecutadas
- **Branches**: Ramas condicionales
- **Functions**: Funciones llamadas
- **Lines**: Líneas cubiertas

Configurado para excluir:
- Archivos de tipos (`.d.ts`)
- `server.ts` (punto de entrada)

## 🔄 Migración desde tests legacy

Los tests actuales en `tests/nosotros/` usan Axios directamente. Para migrar:

1. **Convertir a Jest/Supertest**:
   ```typescript
   // Antes (Axios)
   const response = await axios.get(`${BASE_URL}/api/nosotros`);

   // Después (Supertest)
   const response = await request(BASE_URL).get('/api/nosotros');
   ```

2. **Usar assertions de Jest**:
   ```typescript
   // Antes
   if (!response.data.vision) throw new Error('Falta visión');

   // Después
   expect(response.body).toHaveProperty('vision');
   ```

## 🐛 Debugging

### Tests que fallan
1. Verificar que el servidor esté ejecutándose
2. Revisar variables de entorno
3. Verificar tokens de autenticación
4. Revisar logs del servidor durante tests

### Timeout errors
```typescript
// Aumentar timeout para tests lentos
test('test lento', async () => {
  // ... test code
}, 10000); // 10 segundos
```

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Node.js with Jest](https://nodejs.dev/learn/testing-in-nodejs-with-jest)