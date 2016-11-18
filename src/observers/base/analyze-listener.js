import BaseListener from './base-listener';
import { logger } from 'logs/winston-logger';

export default class AnalyzeListener extends BaseListener {
  perform(messageEvent) {
    this._analyze(messageEvent).then(dataAnalysis => {
      this._handle(messageEvent, dataAnalysis).catch(exception => {
        logger.log('error', 'Get %s on handling %j', exception, messageEvent);
      });
    });
  }

  _analyze(messageEvent) {
  }

  _handle(messageEvent, dataAnalysis) {
  }
}
