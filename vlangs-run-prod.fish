#!/usr/bin/env fish

set COMPOSE_FILE "docker-compose.prod.yml"
set URL "http://localhost"
set GHCR_IMAGE "ghcr.io/arielvino/vlangs:latest"
set RESOURCE_GROUP "LanguageLearningUtils_group"
set APP_NAME "vlangs"

# Start timer
set start_time (date +%s)

# Start Docker daemon
echo "Starting Docker daemon..."
systemctl start docker
sleep 2

# Take down current container
echo "Stopping containers..."
docker-compose -f $COMPOSE_FILE down --remove-orphans 2>/dev/null

# Build without cache (Docker handles React build via esproj ProjectReference)
echo "Building Docker image (no cache)..."
docker-compose -f $COMPOSE_FILE build --no-cache

# Tag for GHCR
echo "Tagging image for GHCR..."
docker tag vlangs-server:latest $GHCR_IMAGE

# Push to GHCR
echo "Pushing to GitHub Container Registry..."
docker push $GHCR_IMAGE

# Update Azure
echo "Updating Azure Container Apps..."
az containerapp update \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --image $GHCR_IMAGE

echo "Waiting for Azure to restart (30 seconds)..."
sleep 30

# Start local container for testing
echo "Starting local container..."
docker-compose -f $COMPOSE_FILE up -d

# Wait for server to be ready
echo "Waiting for server to be ready..."
sleep 3

# Open browser
echo "Opening browser at $URL..."
xdg-open $URL

# Calculate elapsed time
set end_time (date +%s)
set duration (math --scale=0 $end_time - $start_time)
set minutes (math --scale=0 $duration / 60)
set seconds (math --scale=0 $duration % 60)

echo "✓ Done! Local server running at $URL"
echo "✓ Azure deployment updated at https://vlangs.org"
printf "⏱ Total time: %02d:%02d\n" $minutes $seconds
