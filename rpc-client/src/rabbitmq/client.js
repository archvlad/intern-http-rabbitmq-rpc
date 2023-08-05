const { EventEmitter } = require('events');
const amqplib = require('amqplib');
const config = require('../config');
const Consumer = require('./consumer');
const Producer = require('./producer');

class RabbitMQClient {
  async init() {
    this.connection = await amqplib.connect(config.rabbitMQ.url);
    this.consumerChannel = await this.connection.createChannel();
    this.producerChannel = await this.connection.createChannel();
    const { queue: replyQueue } = await this.consumerChannel.assertQueue('', {
      exclusive: true,
    });
    this.eventEmitter = new EventEmitter();
    this.consumer = new Consumer(
      this.consumerChannel,
      replyQueue,
      this.eventEmitter,
    );
    this.producer = new Producer(
      this.producerChannel,
      replyQueue,
      config.rabbitMQ.rpcQueue,
    );
    this.consumer.consumeMessage();
  }

  async produce(data) {
    const timeout = 10000;
    const correlationId = await this.producer.produceMessage(data, {
      timeout,
    });

    return Promise.race([
      new Promise((resolve) => {
        console.log('Awaiting response...');
        this.eventEmitter.once(correlationId, (msg) => {
          console.log(
            `Received message: correlation_id = ${msg.properties.correlationId}`,
          );
          resolve(msg.content.toString());
          this.consumerChannel.ack(msg);
        });
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Timeout Error'));
        }, timeout);
      }),
    ]);
  }
}

module.exports = RabbitMQClient;
