#!/bin/bash

# NewDay Project Setup Script

echo "Setting up NewDay project environment..."

# Create a virtual environment for Python projects
echo "Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

echo "Setup complete!"
echo "To activate the virtual environment, run:"
echo "source venv/bin/activate"

echo "Project structure is ready. Place your initial documents in the 'start' directory."