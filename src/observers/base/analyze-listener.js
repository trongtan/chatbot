import { logger } from 'logs/winston-logger';

export default class AnalyzeListener {
  perform(messageEvent) {
    this._analyze(messageEvent).then(dataAnalysis => {
      this._handle(messageEvent, dataAnalysis).catch(exception => {
        logger.log('error', 'Get %s on handling %j', exception, messageEvent);
      });
    });
  }

  _analyze(messageEvent) {
  }

  _handle(dataAnalysis) {
  }
}
