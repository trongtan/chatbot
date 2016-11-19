import { GetStartedListener, GreetingListener } from './validate-listeners';
import {
  AskDiseaseArticlesListener,
  ReadyToChatListener,
  AskIsParentListener,
  AskChildNameListener,
  AskFavoriteTimeListener
} from './analyze-listeners';
import { logger } from 'logs/winston-logger';

export default class RootObserver {
  constructor() {
    this.listeners = [
      new GetStartedListener(),
      new GreetingListener(),
      new AskDiseaseArticlesListener(),
      new ReadyToChatListener(),
      new AskIsParentListener(),
      new AskChildNameListener(),
      new AskFavoriteTimeListener()
    ];
  }

  perform(messageEvent) {
    this.listeners.map(listener => {
      logger.info('Get message %j', messageEvent);
      listener.perform(messageEvent);
    });
  }
}
