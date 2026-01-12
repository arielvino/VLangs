#!/usr/bin/env fish

set COMPOSE_FILE "docker-compose.prod.yml"
set URL "http://localhost"

# Start timer
set start_time (date +%s)

# Start Docker daemon
echo "Starting Docker daemon..."
systemctl start docker
sleep 2

# Build and run prod image locally
echo "Building production Docker image..."
docker-compose -f $COMPOSE_FILE down --remove-orphans 2>/dev/null
docker-compose -f $COMPOSE_FILE build

echo "Starting local production container..."
docker-compose -f $COMPOSE_FILE up -d

sleep 3

echo "Opening browser at $URL..."
xdg-open $URL

# Calculate elapsed time
set end_time (date +%s)
set duration (math --scale=0 $end_time - $start_time)
set minutes (math --scale=0 $duration / 60)
set seconds (math --scale=0 $duration % 60)

echo "✓ Production container running at $URL"
printf "⏱ Total time: %02d:%02d\n" $minutes $seconds
echo "Run 'docker-compose -f $COMPOSE_FILE down' to stop"