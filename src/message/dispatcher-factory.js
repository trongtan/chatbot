import Dispatcher from './dispatcher';
import { MessageProducerFactory, ConversationProducerFactory } from 'message/producer';
import { MessageClassifierFactory } from 'message/classifier';
import { MessageShipperFactory } from 'message/shipper';
import MessageTracker from 'message/tracker/message-tracker';

export default class DispatcherFactory {
  build() {
    const messageClassifier = new MessageClassifierFactory().build();
    const messageProducer = new MessageProducerFactory().build();
    const messageShipper = new MessageShipperFactory().build();
    const conversationProducer = new ConversationProducerFactory().build();
    const messageTracker = new MessageTracker();
    return new Dispatcher(messageClassifier, messageProducer, messageShipper, messageTracker, conversationProducer);
  }
}
