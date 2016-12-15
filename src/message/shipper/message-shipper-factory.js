import MessageShipper from './message-shipper';

export default class MessageShipperFactory {
  build() {
    return new MessageShipper();
  }
}
