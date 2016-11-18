export default {
  GET_STARTED_PAYLOAD: [],
  GREETING_PAYLOAD: [
    {
      text: 'Xin chào! Tôi là bác sĩ Lifebuoy. Bạn đã sẵn sàng để chat với chúng tôi chưa nè',
      replyOptions: [
        {
          content_type: 'text',
          title: 'Có',
          payload: 'READY_TO_CHAT_PAYLOAD'
        },
        {
          content_type: 'text',
          title: 'Không',
          payload: 'NOT_READY_TO_CHAT_PAYLOAD'
        }
      ]
    }
  ],
  READY_TO_CHAT_PAYLOAD: [
    {
      'text': 'Đầu tiên hãy cung cấp cho bác sĩ một vài thông tin của bạn nhé! Bạn là bố hay mẹ?',
      replyOptions: [
        {
          content_type: 'text',
          title: 'Bố',
          payload: 'IS_DAD_PAYLOAD'
        },
        {
          content_type: 'text',
          title: 'Mẹ',
          payload: 'IS_MOM_PAYLOAD'
        },
        {
          content_type: 'text',
          title: 'Mình chưa có con',
          payload: 'NO_CHILDREN_PAYLOAD'
        }
      ]
    }
  ],
  IS_DAD_PAYLOAD: [
    {
      text: 'Ukie, xin chào {{parentalStatus}} {{userName}}. Bé của bạn tên gì nè!'
    }
  ],
  IS_MOM_PAYLOAD: [
    {
      text: 'Ukie, xin chào {{parentalStatus}} {{userName}}. Bé của bạn tên gì nè!'
    }
  ],
  NO_CHILDREN_PAYLOAD: [
    {
      text: 'Ukie, xin chào {{userName}} nhé. Bạn sẽ thích chat với bác sĩ Lifebuoy vào khung giờ nào hàng ngày nè?'
    }
  ]
}
