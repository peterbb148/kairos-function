const { spawnSync } = require('child_process');

const options = {stdio: 'inherit', shell: true};

spawnSync('func', ['extensions', 'install'], options);
spawnSync('func', ['host', 'start'], options);
