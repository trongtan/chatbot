import co from 'co';
import Promise from 'promise';

import {
  GetStartedListener,
  AskDiseaseMenuListener,
  AskDiseaseInformationListener,
  AskRegionalMenuListener,
  StartChatListener
} from './validate-listeners';
import {
  AskDiseaseArticlesListener,
  ReadyToChatListener,
  AskIsParentListener,
  AskChildNameListener,
  AskFavoriteTimeListener,
  AskCustomListener,
  AskPostbackListener
} from './analyze-listeners';

export default class RootObserver {
  constructor() {
    this.validateListeners = [
      new GetStartedListener(),
      new AskDiseaseMenuListener(),
      new AskDiseaseInformationListener(),
      new AskRegionalMenuListener(),
      new StartChatListener()
    ];

    this.analyzeListeners = [
      new AskDiseaseArticlesListener(),
      new ReadyToChatListener(),
      new AskIsParentListener(),
      new AskChildNameListener(),
      new AskFavoriteTimeListener(),
      new AskCustomListener(),
      new AskPostbackListener()
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
