import GetStartedListener from './get_started';
import GreetingListener from './greeting';
import AskDiseaseArticlesListener from './ask-disease-articles';
import ReadyToChatListener from './ready_to_chat';

export default class RootObserver {
  constructor() {
    this.listeners = [
      new GetStartedListener(),
      new GreetingListener(),
      new AskDiseaseArticlesListener(),
      new ReadyToChatListener()
    ];
  }

  perform(messageEvent) {
    this.listeners.map(listener => {
      listener.perform(messageEvent);
    });
  }
}
