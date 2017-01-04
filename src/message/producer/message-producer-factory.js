import MessageProducer from './message-producer';
import MessageTemplate from './message-template';
import MessageRSS from './message-rss';
import RSSTemplate from './rss-template';

export default class MessageProducerFactory {
  build() {
    const messageTemplate = new MessageTemplate();
    const rssTemplate = new RSSTemplate();
    const messageRSS = new MessageRSS(rssTemplate);
    return new MessageProducer(messageTemplate, messageRSS);
  }
}
