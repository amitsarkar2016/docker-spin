const Docker = require('dockerode');

const docker = new Docker();

async function start() {
    const container = await docker.createContainer({
        Image: 'alpine',
        Cmd: ['sh'],
    })
    console.log(container)
}

start();