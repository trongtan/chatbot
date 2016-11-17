import { payloadConstants } from 'utils/constants';

export default [
  {
    text: 'Đầu tiên hãy cung cấp cho bác sĩ một vài thông tin của bạn nhé! Bạn là bố hay mẹ?',
    replyOptions: [
      {
        content_type: 'text',
        title: 'Bố',
        payload: payloadConstants.IS_DAD_PAYLOAD
      },
      {
        content_type: 'text',
        title: 'Mẹ',
        payload: payloadConstants.IS_MOM_PAYLOAD
      },
      {
        content_type: 'text',
        title: 'Mình chưa có con',
        payload: payloadConstants.NO_CHILDREN_PAYLOAD
      }
    ]
  }
]
