#!/bin/bash

# Script para construir el frontend SSR con retry en caso de fallos de red

echo "🚀 Building Rootly SSR Frontend..."

# Función para intentar construir con retry
build_with_retry() {
    local max_attempts=3
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        echo "📦 Attempt $attempt of $max_attempts..."
        
        if docker build -t rootly-ssr-frontend .; then
            echo "✅ Build successful!"
            return 0
        else
            echo "❌ Build failed on attempt $attempt"
            if [ $attempt -lt $max_attempts ]; then
                echo "⏳ Waiting 30 seconds before retry..."
                sleep 30
            fi
            attempt=$((attempt + 1))
        fi
    done
    
    echo "💥 All build attempts failed"
    return 1
}

# Ejecutar construcción con retry
build_with_retry
