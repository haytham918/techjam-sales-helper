#!/bin/bash

echo "Running yarn install in the root directory..."
yarn install

echo "Running yarn install in the ./frontend directory..."
cd frontend
yarn install
cd ..

echo "Running yarn install in the ./backend directory..."
cd backend
yarn install
cd ..

echo "Yarn install completed in all specified directories."

echo "Running yarn start in the root directory..."
yarn start
