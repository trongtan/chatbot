import { GetStartedListener, GreetingListener } from './validate-listeners';
import { AskDiseaseArticlesListener, ReadyToChatListener, AskIsParentListener } from './analyze-listeners';
import { logger } from 'logs/winston-logger';

export default class RootObserver {
  constructor() {
    this.listeners = [
      new GetStartedListener(),
      new GreetingListener(),
      new AskDiseaseArticlesListener(),
      new ReadyToChatListener(),
      new AskIsParentListener()
    ];
  }

  perform(messageEvent) {
    this.listeners.map(listener => {
      logger.info('Get message %j', messageEvent);
      listener.perform(messageEvent);
    });
  }
}
