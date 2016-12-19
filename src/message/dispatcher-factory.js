import Dispatcher from './dispatcher';
import { MessageProducerFactory } from 'message/producer';
import { MessageClassifierFactory } from 'message/classifier';
import { MessageShipperFactory } from 'message/shipper';
import { MessageRefereeFactory } from 'message/referee';

export default class DispatcherFactory {
  build() {
    const messageClassifier = new MessageClassifierFactory().build();
    const messageProducer = new MessageProducerFactory().build();
    const messageShipper = new MessageShipperFactory().build();
    const messageReferee = new MessageRefereeFactory().build();
    return new Dispatcher(messageClassifier, messageProducer, messageShipper, messageReferee);
  }
}
