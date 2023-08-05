class Consumer {
  constructor(channel, replyQueue, eventEmitter) {
    this.channel = channel;
    this.replyQueue = replyQueue;
    this.eventEmitter = eventEmitter;
  }

  consumeMessage() {
    this.channel.consume(this.replyQueue, (msg) => {
      this.eventEmitter.emit(msg.properties.correlationId, msg);
    });
  }
}

module.exports = Consumer;
