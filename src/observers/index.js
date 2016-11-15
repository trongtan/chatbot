import GetStartedListener from './get_started';
import GreetingListener from './greeting';
import AskDiseaseArticlesListener from './ask-disease-articles';

export default class RootObserver {
  constructor() {
    this.listeners = [
      new GetStartedListener(),
      new GreetingListener(),
      new AskDiseaseArticlesListener()
    ];
  }

  perform(messageEvent) {
    this.listeners.map(listener => {
      listener.perform(messageEvent);
    });
  }
}
