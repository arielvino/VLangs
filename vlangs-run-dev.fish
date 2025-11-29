#!/usr/bin/env fish

set REPO_PATH (pwd)
set COMPOSE_FILE "docker-compose.dev.yml"

# Start Docker daemon
echo "Starting Docker daemon..."
systemctl start docker
sleep 2

# Clean up and start containers
echo "Starting development containers..."
docker-compose -f $COMPOSE_FILE down 2>/dev/null
docker system prune -f
docker-compose -f $COMPOSE_FILE up -d

# Wait for server to be ready
sleep 3

# Start client in new terminal
echo "Starting Vite client..."
cd vlangsreact.client
npm run dev
