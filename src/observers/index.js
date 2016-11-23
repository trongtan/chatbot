import co from 'co';
import Promise from 'promise';

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
    this.validateListeners = [
      new GetStartedListener(),
      new GreetingListener(),
    ];

    this.analyzeListeners = [
      new AskDiseaseArticlesListener(),
      new ReadyToChatListener(),
      new AskIsParentListener(),
      new AskChildNameListener(),
      new AskFavoriteTimeListener()
    ];
  }

  perform(messageEvent) {
    const self = this;

    co(function* () {
      for (let listener of self.validateListeners) {
        const listenerHandleResponse = yield listener.perform(messageEvent);
        if (listenerHandleResponse.handled) {
          return Promise.resolve('Handled successfully %s', JSON.stringify(messageEvent));
        }
      }
    }).catch(exception => {
      logger.error('Get exception %s on handling message', JSON.stringify(exception));
    });
  }
}
