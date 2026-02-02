#!/bin/bash

# Build frontend
cd "New folder (5)/pulse-field"
npm install
npm run build

# Copy build to root for deployment
cp -r dist/* ../../