export default class AnalyzeListener {
  perform(messageEvent) {
    this._analyze(messageEvent).then(dataAnalysis => {
      this._handle(messageEvent, dataAnalysis);
    });
  }

  _analyze(messageEvent) {
  }

  _handle(dataAnalysis) {
  }
}
