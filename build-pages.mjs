import fs from 'fs';
import path from 'path';

console.log('Packaging OpenNext output for Cloudflare Pages...');

const outputDir = path.join('.open-next', 'pages-output');

// Create output directory
fs.mkdirSync(outputDir, { recursive: true });

// Copy static assets
if (fs.existsSync(path.join('.open-next', 'assets'))) {
    fs.cpSync(path.join('.open-next', 'assets'), outputDir, { recursive: true });
}

// Copy necessary dependencies for _worker.js
const deps = ['cloudflare', 'server-functions', 'middleware', '.build'];
for (const dep of deps) {
    if (fs.existsSync(path.join('.open-next', dep))) {
        fs.cpSync(path.join('.open-next', dep), path.join(outputDir, dep), { recursive: true });
    }
}

// Copy the worker file as _worker.js
if (fs.existsSync(path.join('.open-next', 'worker.js'))) {
    fs.copyFileSync(path.join('.open-next', 'worker.js'), path.join(outputDir, '_worker.js'));
    console.log('Successfully packaged _worker.js and dependencies for Pages deployment.');
} else {
    console.error('worker.js not found in .open-next/');
    process.exit(1);
}
