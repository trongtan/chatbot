import MessageReferee from './message-referee';
import Rule from './rules';
import Definition from './definitions';

export default class MessageRefereeFactory {
  build() {
    const rules = new Rule();
    const definitions = new Definition(rules);
    return new MessageReferee(definitions);
  }
}
