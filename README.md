# Rootly SSR Frontend

Frontend SSR de Rootly construido con Next.js 15 y arquitectura hexagonal.

## 🏗️ Arquitectura

- **Next.js 15** con App Router
- **TypeScript** para tipado estático
- **Tailwind CSS** para estilos
- **Arquitectura Hexagonal** (Ports & Adapters)
- **TanStack Query** para estado del servidor
- **Zustand** para estado del cliente
- **Zod** para validación de esquemas

## 🚀 Desarrollo

```bash
npm install
npm run dev
```

## 📁 Estructura

```
src/
├── app/                 # Next.js App Router
├── domain/             # Entidades de dominio
├── application/        # Casos de uso y puertos
├── infrastructure/     # Adaptadores externos
└── ui/                # Componentes de interfaz
    ├── components/     # Componentes reutilizables
    ├── features/       # Características por dominio
    └── providers/      # Proveedores de contexto
```

## 🌿 Flujo de Desarrollo

### Crear Nueva Rama

```bash
# Usar el script de utilidad (Linux/Mac)
./scripts/create-branch.sh 001 "user-authentication"

# O en PowerShell (Windows)
.\scripts\create-branch.ps1 001 "user-authentication"

# O manualmente
git checkout develop
git pull origin develop
git checkout -b feature-001-user-authentication
```

### Proceso de Desarrollo

1. **Crear rama** desde `develop`
2. **Desarrollar** la funcionalidad
3. **Commit** con mensajes descriptivos
4. **Push** de la rama
5. **Crear PR** hacia `develop`
6. **Code review** y aprobación
7. **Merge** a `develop`
8. **Eliminar** la rama

### Nomenclatura de Ramas

- `feature-xxx-texto` - Nuevas funcionalidades
- `hotfix-xxx-texto` - Correcciones urgentes
- `release-xxx-texto` - Preparación de releases

Donde `xxx` es un número de 3 dígitos y `texto` está en kebab-case.

## 🔌 Integración API

El frontend actúa como "Closed API" encapsulando la comunicación con los microservicios backend.

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Zod](https://zod.dev/)
