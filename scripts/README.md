# Scripts Directory

This directory contains utility scripts for the USA project.

## Available Scripts

### `killServer.sh`
A utility script to clean up development servers and processes.

**Usage:**
```bash
./scripts/killServer.sh
```

**What it does:**
- Kills processes running on port 5000 (backend server)
- Kills processes running on port 3000 (frontend server)
- Kills common development processes (npm, nodemon, next.js, concurrently)
- Provides clear feedback about what was killed

**When to use:**
- When development servers get stuck or won't start
- Before starting fresh development environment
- When you need to clean up all running processes

**Example output:**
```
🔍 Looking for processes on ports 5000 and 3000...
🔄 Killing process(es) on port 5000 (PID: 12345)
✅ Successfully killed process on port 5000
ℹ️  No process found on port 3000
🔍 Looking for common development processes...
✅ Killed npm run dev processes
✅ Killed nodemon processes
🎉 Server cleanup complete!
💡 You can now start fresh with: npm run dev
```
