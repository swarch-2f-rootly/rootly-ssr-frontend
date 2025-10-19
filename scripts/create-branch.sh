#!/bin/bash

# Script para crear ramas siguiendo la nomenclatura
# Uso: ./scripts/create-branch.sh 001 "user-authentication"

if [ $# -ne 2 ]; then
    echo "Uso: $0 <numero> <descripcion>"
    echo "Ejemplo: $0 001 user-authentication"
    exit 1
fi

NUMBER=$1
DESCRIPTION=$2

# Validar que el número tenga 3 dígitos
if [[ ! $NUMBER =~ ^[0-9]{3}$ ]]; then
    echo "❌ Error: El número debe tener exactamente 3 dígitos"
    exit 1
fi

# Validar que la descripción esté en kebab-case
if [[ ! $DESCRIPTION =~ ^[a-z0-9-]+$ ]]; then
    echo "❌ Error: La descripción debe estar en kebab-case (solo letras minúsculas, números y guiones)"
    exit 1
fi

BRANCH_NAME="feature-${NUMBER}-${DESCRIPTION}"

echo "🌿 Creando rama: $BRANCH_NAME"

# Cambiar a develop
git checkout develop
git pull origin develop

# Crear nueva rama
git checkout -b $BRANCH_NAME

echo "✅ Rama $BRANCH_NAME creada exitosamente"
echo "🚀 Puedes empezar a desarrollar en esta rama"

