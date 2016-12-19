import vm from 'vm';
import { map, keyBy, join, includes, filter, split, trim, uniq, concat, isEmpty } from 'lodash';
import { logger } from 'logs/winston-logger';

export default class Definition {
  constructor(rules) {
    this.rules = rules;
    this.definitions = [];
    this.definitions.push(require('./menu-definition.json'));
    this.definitions.push(require('./greeting-definition.json'));
    this.definitions.push(require('./cold-information-definition.json'));
  }

  loadDefinitions(askingPayloads) {
    const userDefinedRules = this.rules.loadRules();
    let userDefinedDefinitions = this.definitions;
    this.rules.askingPayloads = askingPayloads;

    userDefinedDefinitions = filter(userDefinedDefinitions, ['enabled', true]);
    userDefinedDefinitions = map(userDefinedDefinitions, ({id, when, then}) => {
      return { 'id': id, 'when': when, 'then': then }
    });


    logger.info('[Message Referee] [Rules]: %s', JSON.stringify(userDefinedRules));
    logger.info('[Message Referee] [Definition]: %s', JSON.stringify(userDefinedDefinitions));

    userDefinedDefinitions = filter(userDefinedDefinitions, definition => {
      return this._isPassedAllRules(definition, userDefinedRules, askingPayloads);
    });

    userDefinedDefinitions = keyBy(userDefinedDefinitions, 'id');
    return userDefinedDefinitions;
  }

  _isPassedAllRules(definition, userDefinedRules, askingPayloads) {
    const sandbox = {
      includes: includes,
      definition: definition,
      userDefinedRules: userDefinedRules,
      askingPayloads: askingPayloads,
      passed: false
    };

    const str = 'passed = eval(userDefinedRules[definition.when].rules) ? true : false;';

    const script = new vm.Script(str);

    const context = new vm.createContext(sandbox);
    script.runInContext(context);

    return sandbox.passed;
  }
}
