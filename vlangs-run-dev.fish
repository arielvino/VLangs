#!/usr/bin/env fish

set start_time (date +%s)

# Navigate to project root
if not test -d vlangsreact.client
    if test -d ../vlangsreact.client
        cd ..
    end
end

echo "Starting development servers (no Docker)..."
echo "Building React once..."
cd vlangsreact.client
npm run build
cd ..

echo "Server:  dotnet run (http://localhost:5000)"
echo "Client:  npm run dev (http://localhost:3000)"
echo ""

# Start server in background
cd VLangsReact.Server
dotnet run &
cd ..

# Start client
sleep 2
cd vlangsreact.client
npm run dev

# Cleanup on exit
pkill -f "dotnet run" 2>/dev/null