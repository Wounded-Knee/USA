#!/bin/bash

# Script to kill processes running on ports 5000 and 3000
# Useful for cleaning up development servers

echo "🔍 Looking for processes on ports 5000 and 3000..."

# Function to kill process on a specific port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port 2>/dev/null)
    
    if [ -n "$pid" ]; then
        echo "🔄 Killing process(es) on port $port (PID: $pid)"
        kill -9 $pid 2>/dev/null
        if [ $? -eq 0 ]; then
            echo "✅ Successfully killed process on port $port"
        else
            echo "❌ Failed to kill process on port $port"
        fi
    else
        echo "ℹ️  No process found on port $port"
    fi
}

# Kill processes on port 5000 (backend)
kill_port 5000

# Kill processes on port 3000 (frontend)
kill_port 3000

# Also kill common development processes
echo "🔍 Looking for common development processes..."

# Kill npm processes
pkill -f "npm run dev" 2>/dev/null && echo "✅ Killed npm run dev processes"
pkill -f "npm run server:dev" 2>/dev/null && echo "✅ Killed npm run server:dev processes"
pkill -f "npm run dev:ui" 2>/dev/null && echo "✅ Killed npm run dev:ui processes"

# Kill nodemon processes
pkill -f "nodemon" 2>/dev/null && echo "✅ Killed nodemon processes"

# Kill next.js processes
pkill -f "next dev" 2>/dev/null && echo "✅ Killed next dev processes"

# Kill concurrently processes
pkill -f "concurrently" 2>/dev/null && echo "✅ Killed concurrently processes"

echo "🎉 Server cleanup complete!"
echo "💡 You can now start fresh with: npm run dev"
