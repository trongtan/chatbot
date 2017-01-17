import MessageProducer from './message-producer';
import MessageTemplate from './message-template';
import TarotCardTemplate from './tarot-card-template';

export default class MessageProducerFactory {
  build() {
    const messageTemplate = new MessageTemplate();
    const tarotCardTemplate = new TarotCardTemplate();
    return new MessageProducer(messageTemplate, tarotCardTemplate);
  }
}
