import { map, keyBy, join, includes } from 'lodash';

export default class Rule {
  constructor() {
    this.rules = require('./rules.json');
  }

  loadRules() {
    const userDefinedRules = (map(this.rules, ({id, description, rules}) => {
      return { 'id': id, 'description': description, 'rules': this._makeRule(rules) }
    }));
    return keyBy(userDefinedRules, 'id');
  }

  _makeRule(rulesString) {
    return '( ' + join(rulesString, ' AND ').replace(/'AND'/g, '&&').replace(/'OR'/g, '||') + ' )';
  }
}
