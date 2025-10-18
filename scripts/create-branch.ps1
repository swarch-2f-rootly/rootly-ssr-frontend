# Script para crear ramas siguiendo la nomenclatura
# Uso: .\scripts\create-branch.ps1 001 "user-authentication"

param(
    [Parameter(Mandatory=$true)]
    [string]$Number,
    
    [Parameter(Mandatory=$true)]
    [string]$Description
)

# Validar que el número tenga 3 dígitos
if ($Number -notmatch '^\d{3}$') {
    Write-Host "❌ Error: El número debe tener exactamente 3 dígitos" -ForegroundColor Red
    exit 1
}

# Validar que la descripción esté en kebab-case
if ($Description -notmatch '^[a-z0-9-]+$') {
    Write-Host "❌ Error: La descripción debe estar en kebab-case (solo letras minúsculas, números y guiones)" -ForegroundColor Red
    exit 1
}

$BranchName = "feature-$Number-$Description"

Write-Host "🌿 Creando rama: $BranchName" -ForegroundColor Green

# Cambiar a develop
git checkout develop
git pull origin develop

# Crear nueva rama
git checkout -b $BranchName

Write-Host "✅ Rama $BranchName creada exitosamente" -ForegroundColor Green
Write-Host "🚀 Puedes empezar a desarrollar en esta rama" -ForegroundColor Blue
