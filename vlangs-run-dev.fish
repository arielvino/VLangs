#!/usr/bin/env fish

set COMPOSE_FILE "docker-compose.dev.yml"
set URL "http://localhost:3000"

# Start timer
set start_time (date +%s)

# Start Docker daemon
echo "Starting Docker daemon..."
systemctl start docker
sleep 2

# Navigate to project root if not already there
if not test -d vlangsreact.client
    echo "Finding project root..."
    if test -d ../vlangsreact.client
        cd ..
    end
end

# Clean up and start containers
echo "Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down 2>/dev/null

echo "Starting development containers..."
docker system prune -f
docker-compose -f $COMPOSE_FILE up

# Calculate elapsed time
set end_time (date +%s)
set duration (math $end_time - $start_time)
set minutes (math $duration / 60)
set seconds (math $duration % 60)

echo "✓ Done!"
echo "  Server:  http://localhost:5000"
echo "  Client:  $URL"
printf "⏱ Total time: %02d:%02d\n" $minutes $seconds
