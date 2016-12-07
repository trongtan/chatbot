export default {
  GET_INFORMATION_PAYLOAD: [
    {
      elements: [
        {
          title: "Thông tin dịch bệnh",
          subtitle: "10 loại dịch bệnh hay xuất hiện trong nhà bạn bất cứ lúc nào!",
          image: "http://img.webtretho.com/images/lifepedia/b1.jpg",
          buttons: [
            {
              type: 'postback',
              title: 'Theo bệnh',
              payload: 'SEARCH_BY_DISEASE_PAYLOAD'
            }
          ]
        },
        {
          title: "Thông tin vùng miền",
          subtitle: "Dù là người miền Bắc, Trung hay Nam thì bạn cũng cần phải biết!",
          image: "http://img.webtretho.com/images/lifepedia/b2.jpg",
          buttons: [
            {
              type: 'postback',
              title: 'Theo vùng miền',
              payload: 'SEARCH_BY_REGION_PAYLOAD'
            }
          ]
        },
        {
          title: "Thông tin bệnh viện",
          subtitle: "Địa chỉ các bệnh viện gần nơi ở mà người người cần phải có",
          image: "http://img.webtretho.com/images/lifepedia/b3.jpg",
          buttons: [
            {
              type: 'postback',
              title: 'Tìm theo khu vực',
              payload: 'UNSUPPORTED_PAYLOAD'
            },
            {
              type: 'postback',
              title: 'Tìm theo khu vực',
              payload: 'UNSUPPORTED_PAYLOAD'
            }
          ]
        },
        {
          title: "Địa điểm và lịch tiêm Vắc Xin",
          subtitle: "Bí kíp lận lưng các bậc phụ huynh không nên quên!",
          image: "http://img.webtretho.com/images/lifepedia/b4.jpg",
          buttons: [
            {
              type: 'postback',
              title: 'Địa điểm tiêm vắc xin',
              payload: 'UNSUPPORTED_PAYLOAD',
            },
            {
              type: 'postback',
              title: 'Lịch tiêm vắc xin',
              payload: 'UNSUPPORTED_PAYLOAD',
            }
          ]
        },
        {
          title: "Thông báo dịch bệnh",
          subtitle: "Báo động đỏ! Cập nhật tình hình dịch bệnh xung quanh",
          image: "http://img.webtretho.com/images/lifepedia/b5.jpg",
          buttons: [
            {
              type: 'postback',
              title: 'Thông báo dịch bệnh',
              payload: 'UNSUPPORTED_PAYLOAD'
            }
          ]
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
          payload: 'ASK_HEALTH_PAYLOAD'
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
