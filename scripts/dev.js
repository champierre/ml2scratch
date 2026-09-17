// Set up scratch-gui with the ML2Scratch extension under .dev/ and start the dev server.
// Usage: npm start
const path = require('path');
const fs = require('fs');
const {spawn, spawnSync} = require('child_process');

const GUI_REPO = 'https://github.com/scratchfoundation/scratch-gui.git';
// Keep in sync with .github/workflows/deploy.yml
const GUI_TAG = 'v3.6.18';
const EXTENSION_ID = 'ml2scratch';

const rootDir = path.resolve(__dirname, '..');
const guiDir = path.join(rootDir, '.dev', 'scratch-gui');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

// webpack 4 used by scratch-gui needs the legacy OpenSSL provider on Node.js 17+
const env = Object.assign({}, process.env);
if (Number(process.versions.node.split('.')[0]) >= 17) {
    env.NODE_OPTIONS = `${env.NODE_OPTIONS || ''} --openssl-legacy-provider`.trim();
}

// Extension sources, copied into scratch-gui the same way install.sh does
const syncTargets = [
    {
        from: path.join(rootDir, 'scratch-vm', 'src', 'extensions', `scratch3_${EXTENSION_ID}`),
        to: path.join(guiDir, 'node_modules', 'scratch-vm', 'src', 'extensions', `scratch3_${EXTENSION_ID}`),
        filter: () => true
    },
    {
        from: path.join(rootDir, 'scratch-gui', 'src', 'lib', 'libraries', 'extensions', EXTENSION_ID),
        to: path.join(guiDir, 'src', 'lib', 'libraries', 'extensions', EXTENSION_ID),
        filter: file => path.extname(file) === '.png'
    }
];

const run = (command, args, cwd) => {
    console.log(`\n> ${command} ${args.join(' ')}`);
    const result = spawnSync(command, args, {cwd, env, stdio: 'inherit', shell: process.platform === 'win32'});
    if (result.error) throw result.error;
    if (result.status !== 0) {
        console.error(`\n"${command} ${args.join(' ')}" failed.`);
        process.exit(result.status || 1);
    }
};

const syncFile = (target, file) => {
    const src = path.join(target.from, file);
    if (!target.filter(file) || !fs.existsSync(src) || !fs.statSync(src).isFile()) return false;
    fs.mkdirSync(target.to, {recursive: true});
    fs.copyFileSync(src, path.join(target.to, file));
    return true;
};

// 1. Clone scratch-gui
if (!fs.existsSync(path.join(guiDir, 'package.json'))) {
    fs.mkdirSync(path.dirname(guiDir), {recursive: true});
    run('git', ['clone', '--depth', '1', '--branch', GUI_TAG, GUI_REPO, guiDir], rootDir);
}

// 2. Install scratch-gui dependencies
const installedMarker = path.join(guiDir, 'node_modules', `.${EXTENSION_ID}-dev-installed`);
if (!fs.existsSync(installedMarker)) {
    run(npm, ['install'], guiDir);
    fs.writeFileSync(installedMarker, '');
}

// 3. Register the extension (install.sh is not idempotent, so run it only once)
const extensionManager = path.join(
    guiDir, 'node_modules', 'scratch-vm', 'src', 'extension-support', 'extension-manager.js'
);
if (!fs.readFileSync(extensionManager, 'utf8').includes(`builtinExtensions['${EXTENSION_ID}']`)) {
    env.EXTENSION_DIR = rootDir;
    run('sh', [path.join(rootDir, 'install.sh')], guiDir);
}

// 4. Copy the latest sources, and keep copying them while the dev server is running
syncTargets.forEach(target => {
    fs.readdirSync(target.from).forEach(file => syncFile(target, file));
    const timers = {};
    fs.watch(target.from, (eventType, file) => {
        if (!file) return;
        clearTimeout(timers[file]);
        timers[file] = setTimeout(() => {
            if (syncFile(target, file)) console.log(`[${EXTENSION_ID}] synced ${file}`);
        }, 100);
    });
});

// 5. Start scratch-gui (http://localhost:8601/)
console.log('\n> npm start (scratch-gui) - open http://localhost:8601/ when the build finishes');
const server = spawn(npm, ['start'], {cwd: guiDir, env, stdio: 'inherit', shell: process.platform === 'win32'});
server.on('exit', code => process.exit(code === null ? 1 : code));
['SIGINT', 'SIGTERM'].forEach(signal => process.on(signal, () => server.kill(signal)));
