import { payloadConstants } from 'utils/constants';

export default [
  {
    text: 'Xin chào! Tôi là bác sĩ Lifebuoy. Bạn đã sẵn sàng để chat với chúng tôi chưa nè',
    replyOptions: [
      {
        content_type: 'text',
        title: 'Có',
        payload: payloadConstants.READY_TO_CHAT_PAYLOAD
      },
      {
        content_type: 'text',
        title: 'Không',
        payload: payloadConstants.NOT_READY_TO_CHAT_PAYLOAD
      }
    ]
  }
]
