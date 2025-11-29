#!/bin/bash

# Setup script for local development

echo "Setting up Airtable Form Builder..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "Warning: MongoDB is not installed. You'll need MongoDB to run the backend."
fi

# Backend setup
echo ""
echo "Setting up backend..."
cd backend

if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Please edit backend/.env with your configuration"
fi

echo "Installing backend dependencies..."
npm install

cd ..

# Frontend setup
echo ""
echo "Setting up frontend..."
cd frontend

if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
fi

echo "Installing frontend dependencies..."
npm install

cd ..

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your Airtable OAuth credentials and MongoDB URI"
echo "2. Start MongoDB: mongod"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend: cd frontend && npm start"
echo ""
echo "Visit http://localhost:3000 to use the application"
