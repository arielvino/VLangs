#!/usr/bin/env fish

set start_time (date +%s)

# Navigate to project root
if not test -d vlangsreact.client
    if test -d ../vlangsreact.client
        cd ..
    end
end

echo "Starting development servers (Debug mode with strict checking)..."
echo "Building React with strict checking..."
cd vlangsreact.client
npm run build -- --mode development
cd ..

echo "Server:  dotnet run -c Debug (http://localhost:5000)"
echo "Client:  npm run dev (http://localhost:3000)"
echo ""

# Start server in background with Debug config
cd VLangsReact.Server
dotnet run -c Debug &
cd ..

# Start client
sleep 2
cd vlangsreact.client
npm run dev

# Cleanup on exit
pkill -f "dotnet run" 2>/dev/null