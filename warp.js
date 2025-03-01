#!/usr/bin/env node
import { spawn } from 'child_process';

// Run the actual script
spawn('node', ['app/warp/bin/warp.js', ...process.argv.slice(2)], {
    stdio: 'inherit',
    shell: true
});
