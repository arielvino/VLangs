#!/usr/bin/env fish

set COMPOSE_FILE "docker-compose.dev.yml"

# Start Docker daemon
echo "Starting Docker daemon..."
systemctl start docker
sleep 2

# Navigate to project root if not already there
if not test -d vlangsreact.client
    echo "Finding project root..."
    # Try to go up if we're in a subdirectory
    if test -d ../vlangsreact.client
        cd ..
    end
end

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