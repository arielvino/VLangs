#!/usr/bin/env fish

set COMPOSE_FILE "docker-compose.prod.yml"
set URL "http://localhost"

# Start Docker daemon
echo "Starting Docker daemon..."
systemctl start docker
sleep 2

# Take down current container
echo "Stopping containers..."
docker-compose -f $COMPOSE_FILE down 2>/dev/null

# Build
echo "Building..."
docker-compose -f $COMPOSE_FILE build

# Start up
echo "Starting containers..."
docker-compose -f $COMPOSE_FILE up -d

# Wait for server to be ready
echo "Waiting for server to be ready..."
sleep 3

# Open browser
echo "Opening browser at $URL..."
xdg-open $URL

echo "Done! Server running at $URL"
