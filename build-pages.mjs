import fs from 'fs';
import path from 'path';

console.log('Organizing OpenNext output for Cloudflare Pages deployment...');

const baseDir = '.open-next';
const assetsDir = path.join(baseDir, 'assets');

// 1. Move everything from assets/ up to baseDir/
if (fs.existsSync(assetsDir)) {
    const items = fs.readdirSync(assetsDir);
    for (const item of items) {
        fs.cpSync(path.join(assetsDir, item), path.join(baseDir, item), { recursive: true });
    }
    // Remove the original assets directory
    fs.rmSync(assetsDir, { recursive: true, force: true });
    console.log('Moved static assets to root of .open-next/');
}

// 2. Rename worker.js to _worker.js
if (fs.existsSync(path.join(baseDir, 'worker.js'))) {
    fs.renameSync(path.join(baseDir, 'worker.js'), path.join(baseDir, '_worker.js'));
    console.log('Renamed worker.js to _worker.js');
}

// 3. Generate _routes.json to exclude static assets from worker
const routes = {
    version: 1,
    include: ["/*"],
    exclude: [
        "/_next/static/**",
        "/*.svg",
        "/*.png",
        "/*.jpg",
        "/*.gif",
        "/*.ico",
        "/*.css"
    ]
};
fs.writeFileSync(path.join(baseDir, '_routes.json'), JSON.stringify(routes, null, 2));
console.log('Successfully generated _routes.json.');
