const path = require('path');
const express = require('express');
const morgan = require('morgan');
const RabbitMQClient = require('../rabbitmq/client');

const rabbitMQClient = new RabbitMQClient();

const app = express();
const port = process.env.EXPRESS_PORT || 3000;

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/avatar', async (req, res) => {
  try {
    const avavatarBase64 = await rabbitMQClient.produce(req.query);
    const img = Buffer.from(avavatarBase64, 'base64');
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length,
    });
    res.end(img);
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    res.json({ error: error.message });
  }
});

async function start() {
  await rabbitMQClient.init();
  app.listen(port, () => {
    console.log(`Express app listening on port ${port}`);
  });
}

start();
