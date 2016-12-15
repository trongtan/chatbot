import Dispatcher from './dispatcher';
import { MessageProducerFactory } from 'message/producer';
import { MessageClassifierFactory } from 'message/classifier';

export default class DispatcherFactory {
  build() {
    const messageClassifier = new MessageClassifierFactory().build();
    const messageProducer = new MessageProducerFactory().build();
    return new Dispatcher(messageClassifier, messageProducer);
  }
}
