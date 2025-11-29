# Azure Container Apps Deployment Guide

## Prerequisites

1. Azure account with active subscription
2. Azure CLI installed: `az --version`
3. Docker installed (for local testing)
4. Required API keys:
   - OpenAI API key
   - Google Translate API key

## Changes Made for Azure Container Readiness

### Fixed Issues
- ✅ Updated Dockerfile to use .NET 9.0 (matching project target)
- ✅ Fixed DLL name from `Server.dll` to `VLangsReact.Server.dll`
- ✅ Changed container port from 5000 to 80 (standard for Azure)
- ✅ Added `ASPNETCORE_URLS` environment variable for flexible port binding
- ✅ Made HTTPS redirection conditional (disabled in containers)
- ✅ Fixed docker-compose.yml paths for local development
- ✅ Created `.env.example` for environment variables documentation

### Architecture
- **Single Container Deployment**: The server serves both API and static React files
- **Build Process**: React app is built and copied to server's wwwroot during build
- **Client-Side OCR**: Tesseract.js runs in browser, no server resources needed

## Local Testing

1. Create `.env` file from template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API keys

3. Build and run with Docker:
   ```bash
   cd VLangsReact.Server
   docker build -t vlangs:local .
   docker run -p 8080:80 --env-file ../.env vlangs:local
   ```

4. Test at: http://localhost:8080

## Azure Container Apps Deployment

### Option 1: Deploy from Local Docker Image

```bash
# 1. Login to Azure
az login

# 2. Set your subscription
az account set --subscription "<your-subscription-id>"

# 3. Create resource group
az group create \
  --name vlangs-rg \
  --location eastus

# 4. Create Azure Container Registry (ACR)
az acr create \
  --resource-group vlangs-rg \
  --name vlangsacr \
  --sku Basic \
  --admin-enabled true

# 5. Login to ACR
az acr login --name vlangsacr

# 6. Build and push image
cd VLangsReact.Server
az acr build \
  --registry vlangsacr \
  --image vlangs:latest \
  .

# 7. Create Container Apps environment
az containerapp env create \
  --name vlangs-env \
  --resource-group vlangs-rg \
  --location eastus

# 8. Get ACR credentials
ACR_USERNAME=$(az acr credential show --name vlangsacr --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name vlangsacr --query passwords[0].value -o tsv)

# 9. Deploy container app
az containerapp create \
  --name vlangs-app \
  --resource-group vlangs-rg \
  --environment vlangs-env \
  --image vlangsacr.azurecr.io/vlangs:latest \
  --registry-server vlangsacr.azurecr.io \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --target-port 80 \
  --ingress external \
  --secrets \
    gpt-api-key="<your-openai-api-key>" \
    google-translate-api-key="<your-google-translate-api-key>" \
  --env-vars \
    GPT_API_KEY=secretref:gpt-api-key \
    GOOGLE_TRANSLATE_API_KEY=secretref:google-translate-api-key \
    ASPNETCORE_ENVIRONMENT=Production \
  --cpu 0.5 \
  --memory 1Gi \
  --min-replicas 0 \
  --max-replicas 1

# 10. Get the app URL
az containerapp show \
  --name vlangs-app \
  --resource-group vlangs-rg \
  --query properties.configuration.ingress.fqdn \
  --output tsv
```

### Option 2: Deploy from GitHub

```bash
# Deploy with GitHub Actions auto-generated
az containerapp up \
  --name vlangs-app \
  --resource-group vlangs-rg \
  --location eastus \
  --environment vlangs-env \
  --context-path ./VLangsReact.Server \
  --repo https://github.com/<your-username>/<your-repo>
```

## Free Tier Considerations

### Included in Free Tier
- ✅ 180,000 vCPU-seconds/month
- ✅ 360,000 GiB-seconds/month
- ✅ 2 million requests/month
- ✅ Your app with 0.5 vCPU, 1GB RAM fits perfectly

### Resource Configuration
```yaml
CPU: 0.5 vCPU (minimum for .NET apps)
Memory: 1 GiB (sufficient for API + static files)
Min Replicas: 0 (scale to zero when idle - saves resources)
Max Replicas: 1 (adequate for free tier)
```

### Cost Optimization
- Scale to zero when idle (0 min replicas)
- Use consumption plan (free tier)
- Single container deployment
- Client-side OCR processing

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `GPT_API_KEY` | Yes | OpenAI API key for GPT translation |
| `GOOGLE_TRANSLATE_API_KEY` | Yes | Google Cloud Translation API key |
| `ASPNETCORE_URLS` | No | Default: http://+:80 |
| `ASPNETCORE_ENVIRONMENT` | No | Set to Production for deployment |

## Updating the Application

```bash
# Rebuild and push new image
cd VLangsReact.Server
az acr build --registry vlangsacr --image vlangs:latest .

# Update container app
az containerapp update \
  --name vlangs-app \
  --resource-group vlangs-rg \
  --image vlangsacr.azurecr.io/vlangs:latest
```

## Monitoring

```bash
# View logs
az containerapp logs show \
  --name vlangs-app \
  --resource-group vlangs-rg \
  --follow

# View metrics
az monitor metrics list \
  --resource vlangs-app \
  --resource-group vlangs-rg \
  --resource-type Microsoft.App/containerApps
```

## Troubleshooting

### Container fails to start
- Check environment variables are set correctly
- View logs: `az containerapp logs show --name vlangs-app --resource-group vlangs-rg`
- Verify API keys are valid

### App returns 502/503 errors
- Container may not be listening on port 80
- Check health probe configuration
- Increase startup timeout if needed

### Out of memory
- Increase memory allocation (requires paid tier beyond 1GB)
- Check for memory leaks in application

## Security Best Practices

1. **Store secrets in Azure Key Vault** (production)
   ```bash
   # Create Key Vault
   az keyvault create --name vlangs-kv --resource-group vlangs-rg

   # Add secrets
   az keyvault secret set --vault-name vlangs-kv --name gpt-api-key --value "<key>"
   ```

2. **Enable managed identity** for container app
3. **Use private ACR** for images
4. **Enable diagnostics** and monitoring
5. **Configure custom domain** with SSL

## Next Steps

- [ ] Set up custom domain
- [ ] Configure Azure CDN for static assets
- [ ] Enable Application Insights for monitoring
- [ ] Set up CI/CD with GitHub Actions
- [ ] Configure backup and disaster recovery

## Support

For Azure Container Apps documentation:
https://learn.microsoft.com/en-us/azure/container-apps/
