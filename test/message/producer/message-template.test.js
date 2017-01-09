import sinon from 'sinon';
import { expect } from 'chai';
import { beforeEach } from 'mocha';

import MessageTemplate from 'message/producer/message-template';
import { ASSIGN_SENDER_ID_TO_MESSAGE } from 'utils/event-constants';

describe('MessageTemplate', () => {
  let messageTemplate;
  const senderId = 1;

  beforeEach(() => {
    messageTemplate = new MessageTemplate();
  });

  context('#buildTextMessage', () => {
    const templateMessages = [{
      Messages: [{ message: 'message 1' }],
      QuickReplies: [{
        contentType: 'text',
        title: 'title',
        postbackId: '1',
        imageURL: 'test_url'
      }]
    }];

    it('build the text messages', () => {
      const spy = sinon.spy(messageTemplate, 'emit');
      const builtMessages = {
        text: 'message 1',
        quick_replies: [{ content_type: 'text', title: 'title', payload: '1', image_url: 'test_url' }]
      };
      messageTemplate.buildTextMessage(senderId, templateMessages);

      expect(spy.calledWith(ASSIGN_SENDER_ID_TO_MESSAGE, senderId, builtMessages)).to.be.true;
      messageTemplate.emit.restore();
    });
  });

  context('#buildGenericTemplateMessage', () => {
    const elements = [{
      title: 'element title',
      imageURL: 'image_url',
      itemURL: 'item_url',
      subtitle: 'sub title',
      Buttons: [{
        ButtonTypes: {
          value: 'postback'
        },
        title: 'button title',
        Postback: {
          value: 'GREETING'
        }
      }]
    }];

    it('build the generic messages', () => {
      const spy = sinon.spy(messageTemplate, 'emit');
      const builtMessages = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [{
              title: 'element title',
              image_url: 'image_url',
              subtitle: 'sub title',
              buttons: [{ type: 'postback', title: 'button title', payload: 'GREETING' }]
            }]
          }
        }
      };
      messageTemplate.buildGenericTemplateMessage(senderId, elements);

      expect(spy.calledWith(ASSIGN_SENDER_ID_TO_MESSAGE, senderId, builtMessages)).to.be.true;
      messageTemplate.emit.restore();
    });
  });

  context('#buildButtonTemplateMessage', () => {
    const buttonTemplates = [{
      Messages: [{ message: 'message 1' }],
      Buttons: [{
        ButtonTypes: {
          value: 'postback'
        },
        title: 'button title',
        Postback: {
          value: 'GREETING'
        }
      }]
    }];

    it('build the generic messages', () => {
      const spy = sinon.spy(messageTemplate, 'emit');
      const builtMessages = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: 'message 1',
            buttons: [{ type: 'postback', title: 'button title', payload: 'GREETING' }]
          }
        }
      };
      messageTemplate.buildButtonTemplateMessage(senderId, buttonTemplates);

      expect(spy.calledWith(ASSIGN_SENDER_ID_TO_MESSAGE, senderId, builtMessages)).to.be.true;
      messageTemplate.emit.restore();
    });
  });

  context('#buildDiseaseTemplateMessage', () => {
    const disease = [{
      Articles: [{
        title: 'element title',
        imageURL: 'image_url',
        itemURL: 'item_url',
        subtitle: 'sub title'
      }]
    }];

    it('build the disease messages with share button', () => {
      const spy = sinon.spy(messageTemplate, 'emit');
      const diseaseMessages = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [{
              title: 'element title',
              image_url: 'image_url',
              subtitle: 'sub title',
              buttons: [
                {
                  type: 'web_url',
                  url: 'item_url',
                  title: 'Xem bài viết',
                  webview_height_ratio: 'tall'
                },
                {
                  type: 'element_share'
                }]
            }]
          }
        }
      };
      messageTemplate.buildDiseaseTemplateMessage(senderId, disease);

      expect(spy.calledWith(ASSIGN_SENDER_ID_TO_MESSAGE, senderId, diseaseMessages)).to.be.true;
      messageTemplate.emit.restore();
    });
  });
});

