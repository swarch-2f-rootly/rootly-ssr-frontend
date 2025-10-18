# 🌿 Reglas de Nomenclatura de Ramas

## Formato Obligatorio

Todas las ramas deben seguir el formato: `feature-xxx-texto`

### Ejemplos Válidos:
- `feature-001-user-authentication`
- `feature-002-plant-dashboard`
- `feature-003-device-management`
- `feature-004-analytics-integration`
- `feature-005-api-gateway-connection`

### Ejemplos Inválidos:
- ❌ `feature-user-auth` (falta número)
- ❌ `feature-1-auth` (número muy corto)
- ❌ `user-auth` (no sigue el formato)
- ❌ `fix-bug` (debería ser `feature-xxx-fix-bug`)

## Reglas Específicas:

1. **Prefijo obligatorio**: `feature-`
2. **Número de 3 dígitos**: `xxx` (001, 002, 003, etc.)
3. **Texto descriptivo**: `texto` en kebab-case
4. **Separadores**: Solo guiones (`-`)
5. **Longitud**: Máximo 50 caracteres

## Proceso de Desarrollo:

1. **Crear rama** desde `develop`
2. **Desarrollar** la funcionalidad
3. **Crear PR** hacia `develop`
4. **Merge** después de aprobación
5. **Eliminar** la rama después del merge

## Tipos de Ramas:

- `feature-xxx-*` - Nuevas funcionalidades
- `hotfix-xxx-*` - Correcciones urgentes (solo desde main)
- `release-xxx-*` - Preparación de releases
