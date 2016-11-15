export default class ValidateListener {
  perform(messageEvent) {
    if (this._shouldHandle(messageEvent)) {
      this._handle(messageEvent);
    }
  }

  _shouldHandle(messageEvent) {
  }

  _handle(messageEvent) {
  }
}
