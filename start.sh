#!/bin/bash

# Wedding App - Start Script
# Simple script to launch the wedding app locally

echo "💍 Starting Wedding App..."
echo ""
echo "🎉 La aplicación se abrirá en http://localhost:8000"
echo ""
echo "Presiona Ctrl+C para detener el servidor"
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null
then
    python3 -m http.server 8000
# Fallback to Python 2
elif command -v python &> /dev/null
then
    python -m SimpleHTTPServer 8000
# Try Node.js
elif command -v npx &> /dev/null
then
    npx http-server -p 8000
else
    echo "❌ Error: No se encontró Python ni Node.js"
    echo "Por favor instala Python o Node.js para ejecutar el servidor local"
    exit 1
fi
