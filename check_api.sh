#!/bin/bash

# Simple API check script
echo "Checking NewDay Platform API..."

# Check health endpoint
echo "Checking health endpoint..."
curl -s https://api.newday.neyronikol.ru/health || echo "Health check failed"

echo "API check completed!"