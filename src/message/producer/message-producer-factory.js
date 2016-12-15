import MessageProducer from './message-producer';

export default class MessageProducerFactory {
  build() {
    return new MessageProducer();
  }
}
