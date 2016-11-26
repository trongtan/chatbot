import co from 'co';
import Promise from 'promise';

import {
  GetStartedListener,
  GreetingListener,
  AskGuideListener,
  AskMenuListener,
  AskDiseaseMenuListener,
  AskDiseaseInformationListener,
  AskUnsupportedPayloadsListener,
  AskRegionalMenuListener
} from './validate-listeners';
import {
  AskDiseaseArticlesListener,
  ReadyToChatListener,
  AskIsParentListener,
  AskChildNameListener,
  AskFavoriteTimeListener
} from './analyze-listeners';

export default class RootObserver {
  constructor() {
    this.validateListeners = [
      new GetStartedListener(),
      new GreetingListener(),
      new AskGuideListener(),
      new AskMenuListener(),
      new AskDiseaseMenuListener(),
      new AskDiseaseInformationListener(),
      new AskUnsupportedPayloadsListener(),
      new AskRegionalMenuListener()
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
      for (let listener of [...self.validateListeners, ...self.analyzeListeners]) {
        const listenerHandleResponse = yield listener.perform(messageEvent);
        if (listenerHandleResponse.handled) {
          return Promise.resolve('Handled successfully %s', JSON.stringify(messageEvent));
        }
      }
    });
  }
}
