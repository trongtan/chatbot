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
  AskRegionalMenuListener,
  StartChatListener,
  AskHealthListener
} from './validate-listeners';
import {
  AskDiseaseArticlesListener,
  ReadyToChatListener,
  AskIsParentListener,
  AskChildNameListener,
  AskFavoriteTimeListener,
  AskCustomListener
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
      new AskRegionalMenuListener(),
      new StartChatListener(),
      new AskHealthListener()
    ];

    this.analyzeListeners = [
      new AskDiseaseArticlesListener(),
      new ReadyToChatListener(),
      new AskIsParentListener(),
      new AskChildNameListener(),
      new AskFavoriteTimeListener(),
      new AskCustomListener()
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
