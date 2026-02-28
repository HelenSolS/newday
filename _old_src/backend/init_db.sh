#!/bin/bash

# Database initialization script for NewDay Platform

echo "Initializing NewDay Platform database..."

# Create data directory if it doesn't exist
mkdir -p ../data

# Set proper permissions
chmod 755 ../data

# Run database population script
echo "Populating database with webinar content..."
python populate_database.py

if [ $? -eq 0 ]; then
    echo "Database initialization completed successfully!"
else
    echo "Error during database initialization!"
    exit 1
fi