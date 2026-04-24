#!/bin/bash
# CertifyEasy Next.js - Quick Start Script

echo "🚀 CertifyEasy Next.js - Quick Start"
echo "===================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "Next steps:"
    echo "1. Run locally: npm run dev"
    echo "2. Open: http://localhost:3000"
    echo "3. Deploy to Vercel: vercel"
    echo ""
    echo "📖 Read VERCEL_DEPLOYMENT.md for deployment instructions"
else
    echo "❌ Build failed. Check errors above."
    exit 1
fi
