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
      text: 'Đầu tiên hãy cung cấp cho bác sĩ một vài thông tin của bạn nhé! Bạn là bố hay mẹ?',
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
  NOT_READY_TO_CHAT_PAYLOAD: [
    {
      text: 'Cảm ơn bạn! Khi nào cần giúp đỡ thì cứ liên hệ bác sĩ Lifebuoy nhé.'
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
  ],
  ASK_CHILD_NAME_PAYLOAD: [
    {
      text: 'Xin chào {{parentalStatus}} {{userName}} và bé {{childName}} đã đồng hành cùng với bác sĩ Lifebouy. Bạn sẽ thích chat với bác sĩ Lifebuoy vào khung giờ nào hàng ngày nè?',
    }
  ],
  ASK_FAVORITE_TIME_PAYLOAD: [
    {
      text: 'Tuyệt vời! Chúng mình sẽ trò chuyện với nhau vào khung giờ này hàng ngày nhé! Còn bây giờ {{userName}} có muốn trò chuyện cùng với bác sĩ Lifebuoy không nè!',
      replyOptions: [
        {
          content_type: 'text',
          title: 'Có',
          payload: 'CHAT_RIGHT_NOW_PAYLOAD'
        },
        {
          content_type: 'text',
          title: 'Mai nhé',
          payload: 'CHAT_TOMORROW_PAYLOAD'
        },
        {
          content_type: 'text',
          title: 'Thay đổi lại',
          payload: 'CHANGE_FAVORITE_TIME_PAYLOAD'
        }
      ]
    }
  ]
}
