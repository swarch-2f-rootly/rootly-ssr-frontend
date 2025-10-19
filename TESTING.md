# 🧪 Testing Guide - Rootly SSR Frontend

Este documento describe la estrategia de testing por capas implementada en el frontend SSR de Rootly.

## 📋 Estructura de Testing por Capas

### **Capa 1: Backend Tests (API Gateway)**
- **Ubicación**: `rootly-apigateway/`
- **Herramientas**: Go testing, testify
- **Cobertura**: Servicios, repositorios, handlers

### **Capa 2: API Tests (Next.js API Routes)**
- **Ubicación**: `src/__tests__/api/`
- **Herramientas**: Jest, Testing Library
- **Cobertura**: API Routes, GraphQL proxy, middleware

### **Capa 3: Component Tests (React Components)**
- **Ubicación**: `src/__tests__/components/`
- **Herramientas**: Jest, React Testing Library
- **Cobertura**: Hooks, componentes, lógica de negocio

### **Capa 4: E2E Tests (End-to-End)**
- **Ubicación**: `src/__tests__/e2e/`
- **Herramientas**: Playwright
- **Cobertura**: Flujos completos, integración real

## 🚀 Comandos de Testing

### **Testing Unitario**
```bash
# Ejecutar todos los tests unitarios
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage
```

### **Testing E2E**
```bash
# Ejecutar tests E2E
npm run test:e2e

# Ejecutar tests E2E con UI
npm run test:e2e:ui

# Ejecutar tests E2E en modo debug
npx playwright test --debug
```

## 📁 Estructura de Archivos de Test

```
src/__tests__/
├── api/                    # API Routes Tests
│   └── graphql-proxy.test.ts
├── hooks/                  # Custom Hooks Tests
│   └── plants-api.test.ts
├── components/             # Component Tests
│   └── PlantsDashboard.test.tsx
└── e2e/                   # E2E Tests
    └── plants-flow.test.ts
```

## 🔧 Configuración de Testing

### **Jest Configuration**
- **Archivo**: `jest.config.js`
- **Setup**: `jest.setup.js`
- **Cobertura**: 70% mínimo por archivo

### **Playwright Configuration**
- **Archivo**: `playwright.config.ts`
- **Browsers**: Chrome, Firefox, Safari, Mobile
- **Base URL**: `http://localhost:3001`

## 📊 Métricas de Cobertura

### **Objetivos de Cobertura**
- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

### **Verificar Cobertura**
```bash
npm run test:coverage
```

## 🧪 Tipos de Tests

### **1. API Tests**
```typescript
// Ejemplo: GraphQL Proxy Test
describe('GraphQL Proxy API Route', () => {
  it('should proxy GraphQL queries to API Gateway', async () => {
    // Test implementation
  });
});
```

### **2. Hook Tests**
```typescript
// Ejemplo: Plants API Hook Test
describe('useUserPlants', () => {
  it('should fetch user plants successfully', () => {
    // Test implementation
  });
});
```

### **3. Component Tests**
```typescript
// Ejemplo: PlantsDashboard Component Test
describe('PlantsDashboard Component', () => {
  it('should render plants list', () => {
    // Test implementation
  });
});
```

### **4. E2E Tests**
```typescript
// Ejemplo: Plants Flow E2E Test
test('should display plants dashboard', async ({ page }) => {
  // Test implementation
});
```

## 🔄 Flujo de Testing

### **Desarrollo Local**
1. **Unit Tests**: `npm run test:watch`
2. **E2E Tests**: `npm run test:e2e:ui`
3. **Coverage**: `npm run test:coverage`

### **CI/CD Pipeline**
1. **Backend Tests**: Go tests en API Gateway
2. **API Tests**: Jest tests en Next.js
3. **Component Tests**: Jest tests en React
4. **E2E Tests**: Playwright tests
5. **Coverage Report**: Generar y enviar reporte

## 🐛 Debugging Tests

### **Debug Unit Tests**
```bash
# Debug con Node.js inspector
node --inspect-brk node_modules/.bin/jest --runInBand

# Debug con VS Code
# Usar la configuración de debug en .vscode/launch.json
```

### **Debug E2E Tests**
```bash
# Debug con Playwright
npx playwright test --debug

# Debug con headed mode
npx playwright test --headed
```

## 📈 Mejores Prácticas

### **1. Naming Conventions**
- **Archivos**: `*.test.ts` o `*.test.tsx`
- **Describe**: Descripción clara del componente/función
- **It**: Comportamiento específico a testear

### **2. Test Structure**
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something specific', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### **3. Mocking**
- **API Calls**: Mock fetch/axios
- **Hooks**: Mock custom hooks
- **Components**: Mock child components

### **4. Data Testing**
- **Mock Data**: Usar datos realistas
- **Edge Cases**: Probar casos límite
- **Error States**: Probar estados de error

## 🚨 Troubleshooting

### **Problemas Comunes**

#### **Tests no encuentran módulos**
```bash
# Verificar configuración de Jest
npm run test -- --verbose
```

#### **E2E Tests fallan**
```bash
# Verificar que el servidor esté corriendo
npm run dev

# Verificar configuración de Playwright
npx playwright test --list
```

#### **Cobertura baja**
```bash
# Verificar archivos excluidos en jest.config.js
# Añadir más tests para casos no cubiertos
```

## 📚 Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Next.js Testing](https://nextjs.org/docs/testing)

## 🎯 Próximos Pasos

1. **Añadir más tests E2E** para flujos críticos
2. **Implementar visual regression testing** con Playwright
3. **Añadir performance testing** con Lighthouse
4. **Configurar CI/CD** con GitHub Actions
5. **Implementar test data factories** para datos de prueba
