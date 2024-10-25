const express = require('express')
const Docker = require('dockerode')

const app = express();
const docker = new Docker();

app.use(express.json());
 
app.get('/containers', async (req, res) => {
    const containers = await docker.listContainers();
    return res.json({containers: containers.map(e => ({id: e.Id, names: e.Names, images: e.Image}

    ))})
})

app.post('/containers', async (req, res) => {
    const { image } = req.body;
    try {
        // Pull the image
        await docker.pull(image, (err, stream) => {
            if (err) return res.status(500).json({ error: err.message });
            docker.modem.followProgress(stream, onFinished, onProgress);

            function onFinished(err, output) {
                if (err) return res.status(500).json({ error: err.message });
            }

            function onProgress(event) {
                console.log(event);
            }
        });

        // await docker.pull(image);
        

        // Create and start the container
        const container = await docker.createContainer({
            Image: image,
            Cmd: ['sh'],
            AttachStdout: true,
            HostConfig: {
                PortBindings: {
                    '80/tcp': [{ HostPort: '8080' }]
                }
            }
        });

        await container.start();
        return res.json({ container: container.id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


app.listen(9000, () => console.log('Express Server Running on PORT: 9000'))