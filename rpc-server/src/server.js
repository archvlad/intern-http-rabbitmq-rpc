const amqplib = require('amqplib');
const { generateAvatar } = require('./avatar-generator');
const config = require('./config');

async function main() {
  const connection = await amqplib.connect(config.rabbitMQ.url);
  const consumerChannel = await connection.createChannel();
  const producerChannel = await connection.createChannel();
  const { queue: rpcQueue } = await consumerChannel.assertQueue(
    config.rabbitMQ.rpcQueue,
  );

  consumerChannel.consume(rpcQueue, async (msg) => {
    try {
      const { correlationId, replyTo } = msg.properties;
      console.log(
        `Received message: correlation_id = ${correlationId}, reply_to = ${replyTo}`,
      );
      const data = JSON.parse(msg.content.toString());
      console.log('Generating avatar...');
      const avavatarBase64 = await generateAvatar(data);
      console.log('Generated');
      producerChannel.sendToQueue(replyTo, Buffer.from(avavatarBase64), {
        correlationId,
      });
      console.log(
        `Produced message to ${replyTo}: correlation_id = ${correlationId}`,
      );
      consumerChannel.ack(msg);
    } catch (error) {
      console.log(error);
      consumerChannel.nack(msg);
    }
  });
}

main();
