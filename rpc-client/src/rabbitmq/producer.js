const { randomUUID } = require('crypto');

class Producer {
  constructor(channel, replyQueue, rpcQueue) {
    this.channel = channel;
    this.replyQueue = replyQueue;
    this.rpcQueue = rpcQueue;
  }

  async produceMessage(data, { timeout }) {
    const correlationId = randomUUID();
    this.channel.sendToQueue(this.rpcQueue, Buffer.from(JSON.stringify(data)), {
      correlationId,
      replyTo: this.replyQueue,
      expiration: timeout,
    });
    console.log(
      `Produced message to ${this.rpcQueue}: correlation_id = ${correlationId}, reply_to = ${this.replyQueue}`,
    );
    return correlationId;
  }
}

module.exports = Producer;
