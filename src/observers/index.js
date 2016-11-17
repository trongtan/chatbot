import GetStartedListener from './get_started';
import GreetingListener from './greeting';
import AskDiseaseArticlesListener from './ask-disease-articles';
import ReadyToChatListener from './ready_to_chat';
import AskIsParentListener from './ask-is-parent';
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
